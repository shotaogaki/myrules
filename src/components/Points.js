import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

class Points extends Component {
  constructor(){
    super();
    this.state = { isLogin: false, 
                　　points: 0,
                   uid: "",
                   gainPoint: [ 
                     {title:　 "30分勉強する", point: 15},
                     {title:　 "15分家事する", point: 15},
                    ],
                   usePoint: [ 
                     {title:　 "一日だらだらする", point: -150},
                     {title:　 "好きなお菓子を一品", point: -50},
                    ],
                    history: [],
                  };
  }

  renderLoginComponent = () => {
      return (
          <h2>ログインしてください！</h2>
      );
  }

  renderLoginedComponent = () => {
    this.uploadStates(this.state);
      return (
          <div>
              <h1>現在のポイント：{this.state.points}P</h1>
              <div>
                <h2>ためる</h2>
                {this.renderPointView(this.state.gainPoint)}
              </div>
              <div>
                <h2>つかう</h2>
                {this.renderPointView(this.state.usePoint)}
              </div>
              <h2>追加する</h2>
              <form>
                <input id="task" placeholder="なにをする？"></input>
                <input id="point" placeholder="獲得ポイントは？"></input>
                <button onClick={(e) => this.addForm(e)}>add</button>
              </form>
              <h2>履歴</h2>
              <div id="history">
                {this.renderHistory(this.state.history)}
              </div>
          </div>
      );
  }

  renderPointView = (targets) => {
    const pointView = targets.map(target => {
      return (
        <form>
          <span>{target.title}</span>
          <button onClick={(e) => this.calcPoint(e, target.point, target.title)}>{target.point}</button><span>P</span>
          <button onClick={(e) => this.deleteForm(e, target.title, target.point)}>delete</button>
        </form>
      );
    });
    return (
      <div>
        <ol>{pointView}</ol>
      </div>
    )
  }

  renderHistory = (historys) => {
    const historyView = historys.map(history => {
      return (
        <h5>{history}</h5>
      );
    });
    return (
      <div>
        <ol>{historyView}</ol>
      </div>
    )
  }

  uploadStates = (state) => {
    const collection = firebase.firestore().collection('states').doc(state.uid);
    collection.set(state);
  }

  calcPoint = (event, point, title) => {
    event.preventDefault();
    const statePoint = this.state.points;
    const calculatedPoint = parseInt(statePoint + point);
    if(calculatedPoint>=0){
      this.setState({points: calculatedPoint});
    }else{
      alert("ポイントがたりません！");
      return;
    }
    this.addHistory(point, title);
  }

  addHistory = (point, title) => {
    const history = this.state.history.slice(0,50);
    history.unshift(`${new Date()}   ${title}   獲得ポイント：${point}P  現在のポイント：${this.state.points}P`);
    this.setState({history: history});
  }

  addForm = (event) => {
    event.preventDefault();
    const point = parseInt(document.getElementById("point").value);
    const title = document.getElementById("task").value;
    if(title===""){
      alert("なにをする？に文字を入力してください");
    }
    if(point>=0){
      const gain = this.state.gainPoint.slice();
      gain.push({title: title, point: point});
      this.setState({gainPoint: gain});
    }else if(point<0){
      const use = this.state.usePoint.slice(0);
      use.push({title: title, point: point});
      this.setState({usePoint: use});
    }else{
      alert("獲得ポイントに数字を入力してください");
    }
    document.getElementById("point").value = "";
    document.getElementById("task").value = "";
  }

  deleteForm = (event, title, point) => {
    event.preventDefault();
    if(point>0){
      const gainPoint =this.state.gainPoint.filter(target => title!==target.title);
      this.setState({gainPoint: gainPoint});
    }else{
      const usePoint =this.state.usePoint.filter(target => title!==target.title);
      this.setState({usePoint: usePoint});
    }
    this.uploadStates(this.state);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
          const uid = firebase.auth().currentUser.uid;
          this.observeStates(uid);
          this.getStoreState(uid).then((storeState) => {
            if(storeState){
              this.setState(storeState);
            }else{
              this.setState({ isLogin: true, uid: uid });
            }
          });
        }else {
            this.setState({ isLogin: false });
        }
    });
  }

  componentWillUnmount() {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if(user) {
          const uid = firebase.auth().currentUser.uid;
          this.observeStates(uid);
          this.getStoreState(uid).then((storeState) => {
            if(storeState){
              this.setState(storeState);
            }else{
              this.setState({ isLogin: true, uid: uid });
            }
          });
        }else {
            this.setState({ isLogin: false });
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

  observeStates = (id) => {
    const history =firebase.firestore().collection("states").doc(id)
    .onSnapshot(function(doc) {
      return doc.data().history;
    });
    this.setState({history: history});
  } 


  render() {
    return (
      <div>
        {this.state.isLogin ? this.renderLoginedComponent() : this.renderLoginComponent()}    
      </div>
    ); 
  }
}

export default Points;