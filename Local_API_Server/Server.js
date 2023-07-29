const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();  // creating local server api
const port = 6969;      // using port 6969 for api data
app.use(bodyParser.json());
app.use(cors());        // using cross origin policies for cross origin requests

// initializing data array for storing user info 
let data = [
  {
    name: 'huzaifa',
    email: 'abc@gmail.com',
    status: 'enabled',
    password: '123456',
    tasks: [
      { task: 'get running', priority: 'medium' },
      { task: 'get studying', priority: 'high' },
    ],
    notifications: [
      { role: 'admin', note: 'you have not completed your tasks' },
      
    ],
  },
];

// implementing get request for getting data relating specific user
app.get('/data', (req, res) => {
  const email = req.query.email; // getting email from req parameter
  // finding index of user in data array based on query email
  const user = data.find((user) => user.email === email);

  if (user) {
    res.status(200).json(user);// 200 OK if user found
  } else {
    res.status(404).json({ message: 'User not found!' }); // error for no user entry
  }
});

// get request for displaying all data
// use http://localhost:6969/all-data to display all data stored in datarray on api
app.get('/all-data', (req, res) => {
  res.json(data);
});

// delete req for deleting task relating specific user
app.delete('/tasks/:taskcontent', (req, res) => {
  const taskcontent = req.params.taskcontent; // getting task content from req params

  // searching for task and user using loops
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].tasks.length; j++) {
      if (data[i].tasks[j].task === taskcontent) { // getting task to delete
        const index = data[i].tasks.findIndex((task) => task.task === taskcontent);
        if (index !== -1) {
          data[i].tasks.splice(index, 1); // delteing task from data index 
          res.json({ message: 'Task Deleted Successfully' });
          break;
        }
      }
    }
  }
});

// delete request for deleting a notification from api
app.delete('/delete-note/:note', (req, res) => {
  // getting note content to delete
  const note = req.params.note;
  console.log('note: ', note);
  // searching for note
  for (let i=0; i<data.length; i++){
    for (let j=0; j<data[i].notifications.length; j++){
      if(data[i].notifications[j].note === note){
        const index = data[i].notifications.findIndex((note) => note.note === note);
        if(index !== 1){
          data[i].notifications.splice(index, 1);
          res.send('Notification Deleted Successfully!');
          break;
        }else{
          res.send('No such Note Found Yet!');
        }
      }
    }
  }
});

// delete request for deleting user based on email
app.delete('/delete-user', (req, res) => {
  // getting user email from request parameters
  const email = req.query.email;
  console.log('email: ', email);
  // finding index of user to be deleted
  const index = data.findIndex((user) => user.email === email);
  // if there is a user in data array by that name
  if(index !== -1){
    // slicing the array of users based on found index
    data.splice(index, 1);
    // sending success note
    res.send('User Deleted Successfully!');
  }else{
    // if no user find with that email.
    res.status(400).json({message: 'User Not Found'});
  }
});

// putting req to enable/ disable a user
app.put('/update', (req, res) => {
  // getting email and status to update in req body
  const email = req.body.email
  const updation = req.body.status;
  console.log(email, ', ', updation);
  // finding data based on email recieved
  for (let i = 0; i < data.length; i++) {
    if (data[i].email === email) {
      // updating status
      data[i].status = updation;
      console.log('Status Updated successfully: ', data[i].status);
      break;
    }
    else {
      // returning error if user not in api
      res.status(404).json({ message: 'User not found' });
    }
  }
});


// putting req to update password
app.put('/update-password', (req, res) => {
  // getting email, old and new passwords from req body
  const params = req.body.data;
  console.log(params);
  // searching for relevant data
  for (let i = 0; i < data.length; i++) {
    if (data[i].email === params.email && data[i].password === params.password) {
      data[i].password = params.newpassword; // updating password if email & passwrod matched
      res.status(200).json({ message: 'Password updated successfully' });
      break;
    }
  }
});

// posting notification for specific user
app.post('/add-notification', (req, res) => {
  // getting note data using req body
  const { email, data: newNotification } = req.body;

  // searching for reaplavent user based on email
  for (let i = 0; i < data.length; i++) {
    if (data[i].email === email) {
      // pushing note and sender in users notifications array
      data[i].notifications.push(newNotification);
      res.send('Notification added successfully.'); // sending response
      break;
    }
  }
});

// posting new user in api data array
app.post('/add-user', (req, res) => {
  // collecting user info required using req body
  const params = req.body.data;
  console.log(params);
  data = [...data, params]; // adding new data to data array
  res.status(200).json({ message: 'User Added Successfully!' }); // sending 200 OK 
});

// posting task to user on email basis 
app.post('/add-task', (req, res) => {
  // collecting email and tasks based on req body 
  const { email, data: newTask } = req.body;
  console.log(email, "\t", newTask);
  // seraching for user
  for (let i = 0; i < data.length; i++) {
    if (data[i].email === email) {
      data[i].tasks.push(newTask);// pushing task in tasks array if email matches
      res.send('Notification added successfully.');
      break;
    }
  }
});

// server listening on port 6969
app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});