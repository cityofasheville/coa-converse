import React from 'react';
import TinyMCE from 'react-tinymce';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import Html from 'slate-html-serializer';
import { isKeyHotkey } from 'is-hotkey';

//https://github.com/instructure-react/react-tinymce/issues/35

/**
 * Define the default node type.
 *
 * @type {String}
 */
const DEFAULT_NODE = 'paragraph';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.content)
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  componentDidMount() {
    this.textAreaElement = document.getElementById(this.props.id);
    //this.textAreaElement.name = this.props.id;
  }

  handleEditorChange(e) {
    this.props.onChange(e);
  }



  // render() {
  //   return <TinyMCE
  //     id={this.props.id}
  //     key={this.props.content}
  //     content={this.props.content}
  //     config={{
  //       plugins: 'link image code lists',
  //       toolbar: 'undo redo  | bold italic underline strikethrough| alignleft aligncenter alignright | numlist bullist | indent outdent | code',
  //       menubar: 'edit insert format',
  //       menu: {
  //         edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
  //         format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
  //         insert: {title: 'Insert', items: 'link'},
  //         tools: {title: 'Tools', items: 'spellchecker code'}
  //       },
  //       branding: false,
  //       readonly: !this.props.editable,
  //       content_style: !this.props.editable ? "body { background-color: rgb(248, 248, 248) !important; }* { cursor: not-allowed }" : (this.props.invalid ? ".mce-content-body { background-color: #ffe2e2 !important }": "body { background: #fff }"),
  //       browser_spellcheck: true,
  //       height: 250,
  //     }}
  //     onKeyup={this.handleEditorChange}
  //     onBlur={this.handleEditorChange}
  //   />;
  // }

  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */
  state = {
    value: html.deserialize(this.props.content ? this.props.content : ''),
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasMark = (type) => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasBlock = (type) => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */
  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        onMouseDown={this.props.editable ? (event => this.onClickMark(event, type)) : undefined}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */
  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value } = this.state;
      const parent = value.document.getParent(value.blocks.first().key);
      isActive = this.hasBlock('list-item') && parent && parent.type === type;
    }

    return (
      <Button
        active={isActive}
        onMouseDown={this.props.editable ? (event => this.onClickBlock(event, type)) : undefined}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */
  renderNode = (props) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
    }
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */
  renderMark = (props) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
    }
  };

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */
  onChange = ({ value }) => {
    console.log(html.serialize(value));
    this.setState({ value });
  };

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */
  onKeyDown = (event, change) => {
    let mark;

    console.log(event.key);
    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => (
        !!document.getClosest(block.key, parent => parent.type === type))
      );

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        change
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        change.setBlocks('list-item').wrapBlock(type);
      }
    }

    this.onChange(change);
  };

  render() {
    return (
      <div className={this.props.editable ? 'rte' : 'rte rte-disabled'}>
        <Toolbar tabIndex="0">
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
        </Toolbar>
        <Editor
          id={this.props.id}
          readOnly={!this.props.editable}
          spellCheck
          autoFocus
          placeholder="Enter text..."
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          className={(this.props.editable && this.props.invalid) ? 'rte-invalid' : undefined}
          //onKeyup={this.handleEditorChange}
          //onBlur={this.handleEditorChange}
        />
      </div>
    );
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

const Button = ({ reversed, active, children, ...rest }) => (
  <span
    className="rte-button"
    style={{
      color: reversed
        ? active ? 'white' : '#aaa'
        : active ? 'black' : '#ccc',
    }}
    {...rest}
  >
    {children}
  </span>
);

Button.propTypes = {
  reversed: PropTypes.bool,
  active: PropTypes.bool,
};

Button.defaultProps = {
  reversed: false,
  active: true,
};

const Icon = ({ children, ...rest }) => (
  <span className="rte-icon material-icons" {...rest}>{children}</span>
);

Icon.propTypes = {
  iconName: PropTypes.string.isRequired,
};

const Menu = ({ className, children, ...rest }) => (
  <div className={`rte-menu ${className}`} {...rest}>{children}</div>
);

const Toolbar = ({ children, ...rest }) => (
  <Menu className="rte-toolbar" {...rest}>{children}</Menu>
);

const html = new Html({
  // parseHtml: JSDOM.fragment,
  rules: [
    {
      serialize(obj, children) {
        switch (obj.object) {
          case 'block': {
            switch (obj.type) {
              case 'paragraph':
                return React.createElement('p', {}, children);
              case 'quote':
                return React.createElement('blockquote', {}, children);
            }
          }
          case 'mark': {
            switch (obj.type) {
              case 'bold':
                return React.createElement('strong', {}, children);
              case 'italic':
                return React.createElement('em', {}, children);
            }
          }
        }
      },
    },
  ],
});
