# React Native Statusbar Alert

A status bar alert (e.g. in-call, recording, navigating) for React Native.

## Install

`npm install react-native-statusbar-alert --save` or `yarn add react-native-statusbar-alert`

## Usage

### Basic

```js
<StatusBarAlert
  visible={true}
  message="Silent Switch ON"
  backgroundColor="#3CC29E"
  color="white"
/>
```

![basic](screenshots/react-native-statusbar-alert.mov.gif)


### Press

```js
<StatusBarAlert
  visible={true}
  message="Silent Switch ON"
  backgroundColor="#3CC29E"
  color="white"
  onPress={() => this.navigator.push({id: 'SilentAlert'})}
/>
```

![press](screenshots/react-native-statusbar-alert-press.mov.gif)

### Children

```js
<StatusBarAlert
  visible={true}
  height={68}
  style={{
    padding: 5
  }}
>
  <Image
    style={{ width: 66, height: 58 }}
    source={{
      uri: 'https://facebook.github.io/react-native/img/header_logo.png'
    }}
  />
</StatusBarAlert>
```

## Props

| Name            | Description                     | Required    | Type                      | Default
| :-------------  | :------------------------------ | :---------- | :------------------------ | :------
| visible         | `true` to show, `false` to hide | true        | bool                      | `false`
| message         | message to display in alert     | true        | string                    | `''`
| onPress         | callback on press event         | false       | func                      | `null`
| backgroundColor | background color                | false       | [color][1]                | `'#3DD84C'`
| color           | text color                      | false       | [color][1]                | `'white'`
| height          | height of children container    | false       | int                       | 20
| statusbarHeight | [custom status bar height][2]   | false       | int                       | 20
| hiddenHeight    | height of the bar when hidden   | false       | int                       | 0
| style           | styles for children container   | false       | [style object][3]         | `{}`

[1]: https://facebook.github.io/react-native/docs/colors.html  "React Native Colors"
[2]: https://github.com/brentvatne/react-native-status-bar-size "react-native-status-bar-size"
[3]: https://facebook.github.io/react-native/docs/style.html  "React Native Style"

## Usage with react-navigation

Create a navigation element using reat-navigation:

```js
import { StackNavigator } from 'react-navigation';
```

```js
const NavigationStack = StackNavigator({
	Home: {
		screen: HomeScreen
	},
	Child: {
		screen: ChildScreen
	}
});
```

Render `StatusBarAlert` adjacent with `StatusBar` and `NavigationStack`:

```js
<View style={styles.container}>
  <StatusBar />
  <StatusBarAlert
    visible={this.state.alert}
    message="Alert!"
    onPress={this.toggleAlert}
  />
  <NavigationStack />
</View>
```

See the [ReactNativeStatusBarAlert](/ReactNativeStatusBarAlert) directory for a complete example.

## Alert stack example

Much like a route stack, you can keep an alert stack as an array of alert objects in your component's state. The StatusBarAlert will render the first alert in the stack, so that as new alerts are pushed into the stack, it will render the most recent alert. If an alert is popped from the stack, StatusBarAlert will render any remaining alerts and when the stack is empty, StatusBarAlert will hide itself. Additionally, the object spread operator (`{...this.state.alerts[0]}`) allows you to declare the default props for alerts in `render()` (e.g. `backgroundColor="#3CC29E"`) and override those props in the alert object (e.g. `backgroundColor="#FF6245"`).

```js
render() {
  return (
    <View style={styles.container}>
      <StatusBarAlert
        backgroundColor="#3CC29E"
        color="white"
        visible={this.state.alerts.length > 0}
        {...this.state.alerts[0]}
      />
      <Navigator
        initialRoute={initialRoute}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={routeMapper}
            style={{top: -20}}
          />
        }
      />
    </View>
  )
}
showSilentAlert() {
  this.setState({
    alerts: [{
      message: 'Silent Switch ON',
      onPress: () => this.navigator.push({id: 'SilentAlert'}),
      backgroundColor="#FF6245"
    }, ...this.state.alerts]
  })
}
hideSilentAlert() {
  this.setState({
    alerts: this.state.alerts.filter(alert => alert.message !== 'Silent Switch ON')
  })
}
```

## Example app

See the [ReactNativeStatusBarAlertExample](https://github.com/gnestor/react-native-statusbar-alert/tree/master/ReactNativeStatusBarAlertExample) directory for an example React Native app using react-native-statusbar-alert.
