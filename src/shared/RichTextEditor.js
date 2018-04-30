import React from 'react';
import TinyMCE from 'react-tinymce';
import PropTypes from 'prop-types';

//https://github.com/instructure-react/react-tinymce/issues/35

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  componentDidMount() {
    this.textAreaElement = document.getElementById(this.props.id);
    this.textAreaElement.name = this.props.id;
  }

  handleEditorChange(e) {
    this.props.onChange(e);
  }

  render() {
    return <TinyMCE
      id={this.props.id}
      key={this.props.content}
      content={this.props.content}
      config={{
        plugins: 'link image code lists',
        toolbar: 'undo redo  | bold italic underline strikethrough| alignleft aligncenter alignright | numlist bullist | indent outdent | code',
        menubar: 'edit insert format',
        menu: {
          edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
          format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
          insert: {title: 'Insert', items: 'link'},
          tools: {title: 'Tools', items: 'spellchecker code'}
        },
        branding: false,
        readonly: !this.props.editable,
        content_style: !this.props.editable ? "body { background-color: rgb(248, 248, 248) !important; }* { cursor: not-allowed }" : (this.props.invalid ? ".mce-content-body { background-color: #ffe2e2 !important }": "body { background: #fff }"),
        browser_spellcheck: true,
        height: 250,
      }}
      onKeyup={this.handleEditorChange}
      onBlur={this.handleEditorChange}
    />;
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
  invalid: false,
};

export default RichTextEditor;
