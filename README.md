# my-rules-react<br />
概要：reactを使用した目標達成、習慣化を目的としたアプリケーションです。<br />
自分でルール、ポイント数を設定しポイントを稼ぎ、獲得したポイントは自身のご褒美に使用します<br />
ポイントを貯める方法や消費方法を設定、削除出来ます。<br />
過去のポイント履歴も確認出来ます。<br />
また、データが永続化されるため、いつでも確認可能です。<br />
<br />
<img src="./sample3.png" width="400px">
# 機能一覧：<br />
・googleログイン機能（firebase）<br />
・リアルタイムアップデート（firebase onSnapshot()メソッド）<br />
・データの永続化（firebase firestore）<br />
・ポイント獲得方法の削除と追加（firebase firestore）<br />
・ポイント使用方法の削除と追加（firebase firestore）<br />
・ポイント使用履歴、現在のポイント数の表示（firebase firestore）<br />

# ソフトウェア構成<br />
    react: 16.13.1,<br />
    react-dom: 16.13.1,<br />
    react-router-dom: 5.2.0<br />
    react-scripts: 3.4.1<br />
    @material-ui/core: 4.10.1,<br />
    @material-ui/icons: 4.9.1,<br />
    @testing-library/jest-dom: 4.2.4,<br />
    @testing-library/react: 9.5.0,<br />
    @testing-library/user-event: 7.2.1,<br />
    dotenv: 8.2.0,<br />
    firebase: 7.15.0,<br />
    flow-bin: 0.125.1
