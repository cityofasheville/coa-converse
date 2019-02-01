import React from 'react';
import ReactDOM from 'react-dom';
// import 'babel-polyfill';

// Import TinyMCE
import tinymce from 'tinymce/tinymce';

// A theme is also required
import 'tinymce/themes/modern/theme';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';


// Initialize the app
tinymce.init({
  selector: '#tiny',
  plugins: ['paste', 'link', 'image', 'code', 'lists'],
});

// Import styles
require('./styles/styles.scss');

import App from './app/App';


// https://github.com/ReactTraining/react-router/tree/v3/docs
ReactDOM.render(
  <App />
, document.getElementById('app'));
