import React from 'react';
import { Audio } from 'expo-av';
import {
  View,
  StatusBar,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Clipboard,
  Button
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  InputToolbar,
} from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow-text';
import { dialogflowConfig } from './env';
const BOT_USER = {
  _id: 2,
  name: 'Sanya',
  avatar: 'https://i.dlpng.com/static/png/1195169-ac-avatar-ugpng-avatar-png-512_512_preview.png',
};


import Profile from './Profile'


export default class App extends React.Component {
  constructor(props) {
    super(props);
    let firstMsg = {
      _id: 1,
      text: 'Hey there! Type anything to get started.',
      createdAt: new Date(),
      system: true,
      user: BOT_USER,
    };

    this.state = {
      messages: [firstMsg],
    };
  }

  componentDidMount() {
    Dialogflow_V2.setConfiguration(

      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    
    );
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      //createdAt: new Date(Date.UTC(2019, 5, 11, 17, 20, 0)),
      createdAt: new Date(),
      user: BOT_USER,
    };
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  handleGoogleResponse(result) {
    console.log(result);
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error)
    );
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#e5e5e5',
          },
          right: {
            backgroundColor: '#FF3D00',
          },
        }}
      />
    );
  };
  renderSend(props) {
    return (
      <Send {...props}>
        <View
          style={{
            marginTop: 2,
            marginRight: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginBottom: 8,
              color: '#FF3D00',
            }}>
            Send
          </Text>
        </View>
      </Send> 
    );
  }
  onLongPress(context, message) {
    console.log(context, message);
    const options = ['Copy','Delete', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            // Your delete logic
            //Clipboard.setString(message);
            break;
          case 1:
            // Your delete logic
            break;
          default:
            break;
        }
      }
    );
  }
  renderSystemMessage = props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 10,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar hidden />
        <View style={{ backgroundColor: '#fff' }}>
          <TouchableOpacity>
            {/*Donute Button Image */}
            <Image
              source={require('./assets/back.png')}
              style={{
                marginLeft: 10,
                marginTop: 10,
                width: 25,
                height: 25,
                tintColor: '#FF3D00',
              }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 15, color: '#aaa', textAlign: 'center' }}>
            💬 Helix chatbot [485 project]!
          </Text>
          <Text>   </Text>
          <Button title="User Login"
          onPress={
            () => this.props.navigation.navigate('Profile')
          }
          />
        </View>
        <GiftedChat
          onLongPress={this.onLongPress}
          renderLoading={() => (
            <ActivityIndicator size="large" color="#FF3D00" />
          )}
          renderSystemMessage={this.renderSystemMessage}
          renderAvatar={null}
          renderSend={this.renderSend}
          renderBubble={this.renderBubble}
          inverted={true}
          locale="pt-BR"
          onPressAvatar={() => Alert.alert('Hello! How are you?')}
          placeholder={'Say Hi!'}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }


}
