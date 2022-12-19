/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
// import App from './src/App/App';
import App from './src/Common/TestPage';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
