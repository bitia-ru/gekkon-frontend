import React, {Component}           from 'react';
import LikeButton                   from '../LikeButton/LikeButton';
import Button                       from '../Button/Button';
import CommentBlock                 from '../CommentBlock/CommentBlock';
import RouteStatus                  from '../RouteStatus/RouteStatus';
import CollapsableBlock             from '../CollapsableBlock/CollapsableBlock';
import CommentForm                  from '../CommentForm/CommentForm';
import Counter                      from '../Counter/Counter';
import RouteDataTable               from '../RouteDataTable/RouteDataTable';
import RouteEditor                  from '../RouteEditor/RouteEditor';
import PropTypes                    from 'prop-types';
import Axios                        from 'axios/index';
import * as R                       from 'ramda';
import ApiUrl                       from '../ApiUrl';
import {DEFAULT_COMMENTS_DISPLAYED} from '../Constants/Comments'
import {withRouter}                 from 'react-router-dom';
import {connect}                    from 'react-redux';
import {updateRoute}                from "../actions";
import Cookies                      from 'js-cookie';
import {ToastContainer}             from 'react-toastr';
import './RoutesShowModal.css';

class RoutesShowModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: (this.props.route.photo === null ? '/public/route-img/route.jpg' : this.props.route.photo.url),
            object_id: null,
            quoteComment: null,
            commentContent: '',
            comments: [],
            numOfDisplayedComments: DEFAULT_COMMENTS_DISPLAYED,
            descriptionCollapsed: false,
            numOfLikes: 0,
            numOfComments: 0,
            isLiked: false,
            likeId: 0,
            numOfRedpoints: 0,
            numOfFlash: 0,
            ascent: null,
            editMode: false,
            currentPointers: [],
            currentPointersOld: [],
            realImageW: 0,
            realImageH: 0,
            currentImageW: 0,
            currentImageH: 0,
            currentLeftShift: 0,
            currentTopShift: 0
        }
    }

    componentDidMount() {
        let img = new Image();
        let self = this;
        img.onload = function () {
            self.setState(
                {
                    realImageW: this.width,
                    realImageH: this.height
                });
            setTimeout(function () { //TODO nextTick
                self.updateDimensions();
            }, 1000);
        };
        img.src = this.state.url;
        this.reloadComments();
        this.reloadLikes();
        this.reloadAscents();
        this.loadPointers();
    }

    displayError = (error) => {
        if (error.response.status === 404 && error.response.statusText === 'Not Found') {
            this.container.error(error.response.data.message, 'Ошибка', {closeButton: true});
            return;
        }
        if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            this.container.error(error.response.data, 'Ошибка', {closeButton: true});
            return;
        }
        this.container.error("Неожиданная ошибка", 'Ошибка', {closeButton: true});
    };

    updateDimensions = () => {
        this.setState(
            {
                currentImageW: this.state.realImageW / this.state.realImageH * this.currentContainerH(),
                currentImageH: this.currentContainerH(),
                currentLeftShift: (this.currentContainerW() - this.state.realImageW / this.state.realImageH * this.currentContainerH()) / 2.0
            });
    };

    reloadRoute = () => {
        Axios.get(`${ApiUrl}/v1/routes/${this.props.route.id}`)
            .then(response => {
                this.props.updateRoute(this.props.route.id, response.data.payload);
            }).catch(error => {
            this.displayError(error)
        });
    };

    reloadComments = () => {
        Axios.get(`${ApiUrl}/v1/routes/${this.props.route.id}/route_comments`)
            .then(response => {
                this.setState({
                    comments: this.formattedCommentsData(response.data.payload),
                    numOfComments: response.data.metadata.all
                });
            }).catch(error => {
            this.displayError(error)
        });
    };

    reloadLikes = () => {
        Axios.get(`${ApiUrl}/v1/routes/${this.props.route.id}/likes`)
            .then(response => {
                let like = this.props.user === null ? 0 : (R.find(R.propEq('user_id', this.props.user.id))(response.data.payload));
                let isLiked = this.props.user === null ? false : (like !== undefined);
                this.setState({
                    numOfLikes: response.data.metadata.all,
                    isLiked: isLiked,
                    likeId: like === undefined ? 0 : like.id
                });
            }).catch(error => {
            this.displayError(error)
        });
    };

    reloadAscents = () => {
        Axios.get(`${ApiUrl}/v1/routes/${this.props.route.id}/ascents`)
            .then(response => {
                let ascent = this.props.user === null ? null : (R.find(R.propEq('user_id', this.props.user.id))(response.data.payload));
                this.setState({
                    ascent: ascent === undefined ? null : ascent,
                    numOfRedpoints: R.filter(R.propEq('result', 'red_point'), response.data.payload).length,
                    numOfFlash: R.filter(R.propEq('result', 'flash'), response.data.payload).length
                });
            }).catch(error => {
            this.displayError(error)
        });
    };

    flatten = (arr) => {
        if (arr.length === 0) {
            return [];
        }
        return R.map((e) => R.concat([e], this.flatten(e['route_comments'])), arr);
    };

    formattedCommentsData = (data) => {
        let self = this;
        return R.map((comment) => {
            let c = R.clone(comment);
            c['route_comments'] = R.flatten(self.flatten(c['route_comments']));
            return c
        }, data);
    };

    startAnswer = (quoteComment) => {
        this.setState({quoteComment: quoteComment})
    };

    removeQuoteComment = () => {
        this.setState({quoteComment: null})
    };

    onCommentContentChange = (content) => {
        this.setState({commentContent: content})
    };

    onDescriptionCollapseChange = (isCollapsed) => {
        this.setState({descriptionCollapsed: isCollapsed})
    };

    showPreviousComments = () => {
        this.setState(
            {
                descriptionCollapsed: true,
                numOfDisplayedComments: this.state.comments.length,
                currentImageW: 0,
                currentImageH: 0,
                currentLeftShift: 0
            }, this.updateDimensions);
    };

    saveComment = (route_comment_id) => {
        let params = {
            route_comment: {
                route_id: this.props.route.id,
                author_id: this.props.user.id,
                content: this.state.commentContent
            }
        };
        if (route_comment_id !== null) {
            params.route_comment.route_comment_id = route_comment_id;
        }
        Axios.post(`${ApiUrl}/v1/route_comments`, params, {headers: {'TOKEN': Cookies.get('user_session_token')}})
            .then(response => {
                this.reloadComments();
                this.removeQuoteComment();
                this.onCommentContentChange('');
            }).catch(error => {
            this.displayError(error)
        });
    };

    onLikeChange = () => {
        if (this.state.isLiked) {
            Axios({url: `${ApiUrl}/v1/likes/${this.state.likeId}`, method: 'delete', headers: {'TOKEN': Cookies.get('user_session_token')}})
                .then(response => {
                    this.reloadLikes();
                }).catch(error => {
                this.displayError(error)
            });
        } else {
            let params = {like: {user_id: this.props.user.id, route_id: this.props.route.id}};
            Axios.post(`${ApiUrl}/v1/likes`, params, {headers: {'TOKEN': Cookies.get('user_session_token')}})
                .then(response => {
                    this.reloadLikes();
                }).catch(error => {
                this.displayError(error)
            });
        }
    };

    saveMark = () => {
        let mark = R.clone(this.props.route.mark);
        if (!mark) {
            mark = {colors: {holds: 1, marks: 1}};
        }
        let x = R.map((pointer) => pointer.x, this.state.currentPointers);
        let y = R.map((pointer) => pointer.y, this.state.currentPointers);
        let angle = R.map((pointer) => pointer.angle, this.state.currentPointers);
        mark.pointers = {x: x, y: y, angle: angle};
        let params = {route: {mark: mark}};
        Axios({
            url: `${ApiUrl}/v1/routes/${this.props.route.id}`,
            method: 'patch',
            data: params,
            headers: {'TOKEN': Cookies.get('user_session_token')}
        })
            .then(response => {
                this.setState({editMode: false});
                this.reloadRoute();
            }).catch(error => {
            this.displayError(error)
        });
    };

    loadPointers = () => {
        let pointers = (this.props.route.mark && this.props.route.mark.pointers) ? this.props.route.mark.pointers : {
            x: [],
            y: [],
            angle: []
        };
        let mapIndexed = R.addIndex(R.map);
        pointers = mapIndexed((x, index) => {
            return {
                x: parseInt(x, 10),
                y: parseInt(pointers.y[index], 10),
                dx: 0,
                dy: 0,
                angle: parseInt(pointers.angle[index], 10)
            }
        }, pointers.x);
        this.setState({currentPointers: pointers});
    };

    updatePointers = (pointers) => {
        this.setState({currentPointers: pointers});
    };

    startEdit = () => {
        this.setState({editMode: true, currentPointersOld: this.state.currentPointers})
    };

    setImageContainer = (ref) => {
        this.imageContainer = ref;
    };

    currentContainerW = () => {
        return this.imageContainer ? this.imageContainer.offsetWidth : 0;
    };

    currentContainerH = () => {
        return this.imageContainer ? this.imageContainer.offsetHeight : 0;
    };

    containerX = () => {
        return this.imageContainer ? this.imageContainer.getBoundingClientRect().x : 0;
    };

    containerY = () => {
        return this.imageContainer ? this.imageContainer.getBoundingClientRect().y : 0;
    };

    changeAscentResult = () => {
        if (this.state.ascent) {
            let result = this.state.ascent.result === 'flash' ? 'red_point' : (this.state.ascent.result === 'red_point' ? 'unsuccessful' : 'flash');
            let params = {ascent: {result: result}};
            Axios({url: `${ApiUrl}/v1/ascents/${this.state.ascent.id}`, method: 'patch', params: params, headers: {'TOKEN': Cookies.get('user_session_token')}})
                .then(response => {
                    this.reloadAscents();
                }).catch(error => {
                this.displayError(error)
            });

        } else {
            let result = "flash";
            let params = {ascent: {result: result, user_id: this.props.user.id, route_id: this.props.route.id}};
            Axios.post(`${ApiUrl}/v1/ascents`, params, {headers: {'TOKEN': Cookies.get('user_session_token')}})
                .then(response => {
                    this.reloadAscents();
                }).catch(error => {
                this.displayError(error)
            });
        }
    };

    removeComment = (comment) => {
        Axios({url: `${ApiUrl}/v1/route_comments/${comment.id}`, method: 'delete', headers: {'TOKEN': Cookies.get('user_session_token')}})
            .then(response => {
                this.reloadComments();
            }).catch(error => {
            this.displayError(error)
        });
    };

    render() {
        return <React.Fragment>
            <ToastContainer
                ref={ref => this.container = ref}
                onClick={() => this.container.clear()}
                className="toast-top-right"
            />
            <div className="modal-overlay">
                <div className="modal-overlay__wrapper">
                    <div className="modal modal-overlay__modal">
                        <button className="modal__close" onClick={() => this.props.closeRoutesShow()}></button>
                        <div className="modal__track-block">
                            <div className="modal__track">
                                <RouteEditor route={this.props.route}
                                             pointers={this.state.currentPointers}
                                             setImageContainer={this.setImageContainer}
                                             currentContainerW={this.currentContainerW()}
                                             currentContainerH={this.currentContainerH()}
                                             containerX={this.containerX()}
                                             containerY={this.containerY()}
                                             editable={this.state.editMode}
                                             realImageW={this.state.realImageW}
                                             realImageH={this.state.realImageH}
                                             currentImageW={this.state.currentImageW}
                                             currentImageH={this.state.currentImageH}
                                             currentLeftShift={this.state.currentLeftShift}
                                             currentTopShift={this.state.currentTopShift}
                                             updateDimensions={this.updateDimensions}
                                             updatePointers={this.updatePointers}/>
                            </div>
                            <div className="modal__track-footer">
                                <div className="modal__track-information">
                                    <div className="modal__track-count">
                                        <LikeButton numOfLikes={this.state.numOfLikes} isLiked={this.state.isLiked}
                                                    onChange={this.props.user === null ? () => {
                                                    } : this.onLikeChange}/>
                                    </div>
                                    <div className="modal__track-count">
                                        <Counter number={this.state.numOfRedpoints} text="redpoints"/>
                                    </div>
                                    <div className="modal__track-count">
                                        <Counter number={this.state.numOfFlash} text="flash"/>
                                    </div>
                                </div>
                                {this.props.user === null || (this.props.user.role !== 'admin' &&  this.props.user.role !== 'creator') ? '' :
                                    <React.Fragment>{this.state.editMode ?
                                        <Button size="small" style="normal" title="Сохранить"
                                                disabled={JSON.stringify(this.state.currentPointers) === JSON.stringify(this.state.currentPointersOld)}
                                                onClick={this.saveMark}></Button> :
                                        <Button size="small" style="normal" title="Редактировать"
                                                onClick={this.startEdit}></Button>}</React.Fragment>}
                            </div>
                        </div>
                        <div className="modal__track-info">
                            <div className="modal__track-status">
                                {this.props.user ?
                                    <RouteStatus ascent={this.state.ascent}
                                                 changeAscentResult={this.changeAscentResult}/> : ''}
                            </div>
                            <div className="modal__track-header">
                                <h1 className="modal__title">
                                    {this.props.route.number ? `№ ${this.props.route.number}` : `# ${this.props.route.id}`}
                                    <span
                                        className="modal__title-place">{this.props.route.name ? `(“${this.props.route.name}”)` : ''}</span>
                                </h1>
                                <RouteDataTable route={this.props.route}/>
                            </div>
                            <div className="modal__item modal__descr-item">
                                <CollapsableBlock title="Описание" isCollapsed={this.state.descriptionCollapsed}
                                                  onCollapseChange={this.onDescriptionCollapseChange}
                                                  text={this.props.route.description ? this.props.route.description : ''}/>
                            </div>
                            <div className="modal__item">
                                <CommentBlock startAnswer={this.startAnswer}
                                              user={this.props.user}
                                              removeComment={this.removeComment}
                                              allShown={this.state.comments.length === R.min(this.state.numOfDisplayedComments, this.state.comments.length)}
                                              numOfComments={this.state.numOfComments}
                                              showPrevious={this.showPreviousComments}
                                              onCollapseChange={this.onDescriptionCollapseChange}
                                              comments={R.slice(this.state.comments.length - R.min(this.state.numOfDisplayedComments, this.state.comments.length), this.state.comments.length, this.state.comments)}
                                              objectListTitle="route_comments"/>
                            </div>
                            <div className="modal__enter-comment">
                                <CommentForm quoteComment={this.state.quoteComment}
                                             user={this.props.user}
                                             content={this.state.commentContent}
                                             saveComment={this.saveComment}
                                             onContentChange={this.onCommentContentChange}
                                             removeQuoteComment={this.removeQuoteComment}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}

RoutesShowModal.propTypes = {
    route: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    updateRoute: (id, route) => dispatch(updateRoute(id, route))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesShowModal));
