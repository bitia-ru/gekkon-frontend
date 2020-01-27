import React from 'react';
import CategoryPickerLayout from '@/v2/components/CategoryPicker/CategoryPickerLayout';


class CategoryPicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      category: null,
    };
  }

  onCategoryChanged = (category) => {
    this.setState({ category });
  };

  render() {
    return (
      <CategoryPickerLayout
        category={this.state.category || this.props.category}
        onCategoryChanged={this.onCategoryChanged}
      />
    );
  }
}

export default CategoryPicker;
