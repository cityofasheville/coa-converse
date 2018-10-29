import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';

// Import TinyMCE
import tinymce from 'tinymce/tinymce';

// A theme is also required
import 'tinymce/themes/modern/theme';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';

// Import Routes
import Routes from './routes';



// Initialize the app
tinymce.init({
  selector: '#tiny',
  plugins: ['paste', 'link', 'image', 'code', 'lists'],
});

// Import styles
require('./styles/styles.scss');

render((
  <Routes />
), document.getElementById('app'));
