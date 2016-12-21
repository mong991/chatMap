import React from 'react';
import { connect } from 'dva/mobile';
import { Text, View } from 'react-native';
import {
  Button,
  InputItem,
  List,
  WingBlank,
  Card,
  WhiteSpace,
  ActivityIndicator
} from 'antd-mobile';

function Auth({ dispatch, auth }) {
  const { email, password, error, loading } = auth;

  function onEmailChange(text) {
    dispatch({
      type: 'auth/emailChanged',
      payload: text
    });
  }

  function onPasswordChanged(text) {
    //this.props.passwordChanged(text);
    dispatch({
      type: 'auth/passwordChanged',
      payload: text
    });
  }

  function onButtonPress() {
    dispatch({
      type: 'auth/loginUser',
      payload: { email, password }
    });
  }

  function renderButton() {
    if (loading) {
      return <ActivityIndicator size="large" color="#0080FF" />;
    }

    return (
      <Button type="primary" onClick={onButtonPress} style={{ margin: 10 }}>
        Login
      </Button>
    );
  }

  return (
    <View>
      <WhiteSpace size="lg" />
      <WingBlank>
        <Card>
          <List>
            <InputItem
              labelNumber="5"
              placeholder="email@gmail.com"
              onChange={onEmailChange}
              value={email}
            >
              Email
            </InputItem>

            <InputItem
              labelNumber="5"
              type="password"
              placeholder="enter password"
              onChange={onPasswordChanged}
              value={password}
            >
              Password
            </InputItem>
          </List>

          <View>
            <Text style={styles.errorTextStyle}>
              {error}
            </Text>
            {renderButton()}
          </View>
        </Card>
      </WingBlank>
    </View>
  );
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps)(Auth);

