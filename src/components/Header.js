import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AndroidIcon from '@material-ui/icons/Android';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import 'firebase/auth';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    avatar: {
        margin: 10,
        backgroundColor: 'white',
    },
    link: {
        textDecoration: 'none',
        color: 'white',
    },
});

class Header extends Component {
    constructor() {
        super();

        this.state = { isLogin: false, username: '', profilepicUrl: '', points: '?'};
    }

    // componentWillMount() {
    //     firebase.auth().onAuthStateChanged(user => {
    //         if(user) {
    //             this.setState({ isLogin: true, username: user.displayName, profilepicUrl: user.photoURL });
    //         }else {
    //             this.setState({ isLogin: false, username: '', profilepicUrl: ''});
    //         }
    //     });
    // }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
              const uid = firebase.auth().currentUser.uid;
              this.getStoreState(uid).then((storeState) => {
                if(storeState){
                    this.setState({ isLogin: true, username: user.displayName, profilepicUrl: user.photoURL, points: storeState.points });
                }
              });
            }else {
                this.setState({ isLogin: false, username: '', profilepicUrl: ''});
            }
        });
      }

    componentWillUnmount() {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if(user) {
              const uid = firebase.auth().currentUser.uid;
              this.getStoreState(uid).then((storeState) => {
                if(storeState){
                    this.setState({ isLogin: true, username: user.displayName, profilepicUrl: user.photoURL, points: storeState.points });
                }
              });
            }else {
                this.setState({ isLogin: false, username: '', profilepicUrl: ''});
            }
        });
        unsubscribe();
      }
    
      getStoreState = (uid) => {
        const storeState = firebase.firestore().collection('states').doc(uid).get().then(function(doc) {
          if (doc.exists) {
            return doc.data();
          } else {
            return false;
          }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        return new Promise((resolve) => {
              resolve(storeState);
      });
      }

    googleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    googleSignout = () => {
        firebase.auth().signOut();
    }

    renderLoginComponent = classes => {
        return (
            <Button color="inherit" className={classes.button} onClick={this.googleLogin}>
                Login with Google
            </Button>
        );
    }

    renderLoginedComponent = classes => {
        const uid = firebase.auth().currentUser.uid;
              this.getStoreState(uid).then((storeState) => {
                if(storeState){
                    this.setState({ points: storeState.points });
                }
              });
        return (
            <div>
                <Button color="inherit" className={classes.button}>
                    <Avatar alt="profile image" src={`${this.state.profilepicUrl}`} className={classes.avatar} />
                    {this.state.username}
                </Button>
                <Button color="inherit" className={classes.button} onClick={this.googleSignout}>
                    Sign Out
                </Button>
                <Button variant="contained" color="default">
                    points: {this.state.points} P
                    <AndroidIcon className={classes.rightIcon} />
                </Button>
            </div>
        );
    }

    render() {
        const { classes } = this.props;


        return (
            <div className={classes.root}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            my rules
                        </Typography>
                        {this.state.isLogin ? this.renderLoginedComponent(classes) : this.renderLoginComponent(classes)}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.protoTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);