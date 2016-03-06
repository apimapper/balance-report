# balance-report

## hint relating to credentials file user.json

In case you want to develop new plugin or use plugin and don't like that git sees your modified user.json file then you can ignore changes of it safely with this snippet: 

```sh
git update-index --assume-unchanged configs/paypal/user.json
```

## how to start the app

```sh
# you need to install node.js tools npm >= 3.X.X and node > version 10
# after node.js installation you can run these commands
npm install
npm start
```
