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
import CloseButton                  from '../CloseButton/CloseButton';
import PropTypes                    from 'prop-types';
import * as R                       from 'ramda';
import {DEFAULT_COMMENTS_DISPLAYED} from '../Constants/Comments'
import StickyBar                    from '../StickyBar/StickyBar';
import './RoutesShowModal.css';

export default class RoutesShowModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: (this.props.route.photo === null ? '/public/img/route-img/route.jpg' : this.props.route.photo.url),
            object_id: null,
            quoteComment: null,
            commentContent: '',
            numOfDisplayedComments: DEFAULT_COMMENTS_DISPLAYED,
            descriptionCollapsed: false,
            currentPointers: [],
            currentPointersOld: []
        };
        this.mouseOver = false;
    }

    componentDidMount() {
        this.loadPointers();
        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown = (event) => {
        if (event.key === 'Escape') {
            this.props.onClose();
        }
    };

    startAnswer = (quoteComment) => {
        this.setState({quoteComment: quoteComment});
        this.textareaRef.focus();
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
                numOfDisplayedComments: this.props.comments.length
            });
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
        let self = this;
        this.props.saveComment(params, () => {
            self.removeQuoteComment();
            self.onCommentContentChange('');
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
                x: parseFloat(x),
                y: parseFloat(pointers.y[index]),
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

    setTextareaRef = (ref) => {
        this.textareaRef = ref;
    };

    canEditRoute = (user, route) => {
        if (user.role === 'admin' || user.role === 'creator')
            return true;
        if (user.role === 'user' && route.author_id === user.id)
            return true;
        return false;
    };

    content = () => {
        return <div className="modal-overlay__wrapper">
            <div className="modal modal-overlay__modal">
                <div className="modal-block__close">
                    <CloseButton onClick={() => this.props.onClose()}/>
                </div>
                <div className="modal__track-block" onMouseOver={() => this.mouseOver = true} onMouseLeave={() => this.mouseOver = false}>
                    <div className="modal__track">
                        <div className="modal__track-descr">
                            <div className="modal__track-descr-picture"></div>
                            <div className="modal__track-descr-text">
                                Загрузите фото трассы
                            </div>
                        </div>
                        {this.props.route.photo ?
                            <RouteEditor route={this.props.route}
                                         routePhoto={this.props.route.photo.url}
                                         pointers={this.state.currentPointers}
                                         editable={false}
                                         updatePointers={this.updatePointers}/> : ''}
                    </div>
                    <div
                        className="modal__track-footer">
                        <div className="modal__track-information">
                            <div className="modal__track-count">
                                <LikeButton numOfLikes={this.props.numOfLikes} isLiked={this.props.isLiked}
                                            onChange={this.props.user === null ? () => {
                                            } : this.props.onLikeChange}/>
                            </div>
                            <div className="modal__track-count">
                                <Counter number={this.props.numOfRedpoints} text="redpoints"/>
                            </div>
                            <div className="modal__track-count">
                                <Counter number={this.props.numOfFlash} text="flash"/>
                            </div>
                        </div>
                        {(this.props.user && this.canEditRoute(this.props.user, this.props.route)) ?
                            (this.props.ctrlPressed ? <Button size="small" style="normal" title="Удалить"
                                                              onClick={this.props.removeRoute}></Button> :
                                <Button size="small" style="normal" title="Редактировать"
                                        onClick={this.props.openEdit}></Button>) : ''}
                    </div>
                </div>
                <div className="modal__track-info" onMouseOver={() => this.mouseOver = true} onMouseLeave={() => this.mouseOver = false}>
                    <div className="modal__track-status">
                        {this.props.user ?
                            <RouteStatus ascent={this.props.ascent}
                                         changeAscentResult={this.props.changeAscentResult}/> : ''}
                    </div>
                    <div className="modal__track-header">
                        <h1 className="modal__title">
                            {this.props.route.number ? `№ ${this.props.route.number}` : `# ${this.props.route.id}`}
                            <span
                                className="modal__title-place">{this.props.route.name ? `(“${this.props.route.name}”)` : ''}</span>
                        </h1>
                        <RouteDataTable route={this.props.route} user={this.props.user}/>
                    </div>
                    <div className="modal__item modal__descr-item">
                        <CollapsableBlock title="Описание" isCollapsed={this.state.descriptionCollapsed}
                                          onCollapseChange={this.onDescriptionCollapseChange}
                                          text={this.props.route.description ? this.props.route.description : ''}/>
                    </div>
                    <div className="modal__item">
                        <CommentBlock startAnswer={this.startAnswer}
                                      user={this.props.user}
                                      removeComment={this.props.removeComment}
                                      allShown={this.props.comments.length === R.min(this.state.numOfDisplayedComments, this.props.comments.length)}
                                      numOfComments={this.props.numOfComments}
                                      showPrevious={this.showPreviousComments}
                                      onCollapseChange={this.onDescriptionCollapseChange}
                                      comments={R.slice(this.props.comments.length - R.min(this.state.numOfDisplayedComments, this.props.comments.length), this.props.comments.length, this.props.comments)}
                                      objectListTitle="route_comments"/>
                    </div>
                    <div className="modal__enter-comment">
                        <CommentForm quoteComment={this.state.quoteComment}
                                     setTextareaRef={this.setTextareaRef}
                                     goToProfile={this.props.goToProfile}
                                     user={this.props.user}
                                     content={this.state.commentContent}
                                     saveComment={this.saveComment}
                                     onContentChange={this.onCommentContentChange}
                                     removeQuoteComment={this.removeQuoteComment}/>
                    </div>
                </div>
            </div>
        </div>
    };

    render() {
        return <React.Fragment>
            <div className="modal-overlay" onClick={() => {if (!this.mouseOver) {this.props.onClose()}}}>
                <StickyBar loading={this.props.numOfActiveRequests > 0} content={this.content()} hideLoaded={true}/>
            </div>
        </React.Fragment>;
    }
}

RoutesShowModal.propTypes = {
    route: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    openEdit: PropTypes.func.isRequired,
    ctrlPressed: PropTypes.bool.isRequired,
    removeRoute: PropTypes.func.isRequired,
    goToProfile: PropTypes.func.isRequired,
    comments: PropTypes.array.isRequired,
    numOfComments:  PropTypes.number.isRequired,
    removeComment: PropTypes.func.isRequired,
    saveComment: PropTypes.func.isRequired,
    numOfLikes: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    onLikeChange: PropTypes.func.isRequired,
    numOfRedpoints: PropTypes.number.isRequired,
    numOfFlash: PropTypes.number.isRequired,
    changeAscentResult: PropTypes.func.isRequired,
    numOfActiveRequests: PropTypes.number.isRequired
};
