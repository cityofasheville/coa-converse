import React from 'react';
import TinyMCE from 'react-tinymce';
import PropTypes from 'prop-types';

//https://github.com/instructure-react/react-tinymce/issues/35

class RichTextEditor extends React.Component {
  componentDidMount() {
    this.textAreaElement = document.getElementById(this.props.id);
    this.textAreaElement.name = this.props.id;
  }

  render() {
    return <TinyMCE
      id={this.props.id}
      content={this.props.content}
      config={{
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | indent outdent | code',
        branding: false,
        readonly: !this.props.editable,
        content_style: !this.props.editable ? "body { background-color: rgb(248, 248, 248) !important; }* { cursor: not-allowed }" : "body { background: #fff }",
      }}
      onChange={this.props.onChange}
    />
  }
}

RichTextEditor.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
};

RichTextEditor.defaultProps = {
  editable: true,
};

export default RichTextEditor;
