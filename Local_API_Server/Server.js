const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 6969;
app.use(bodyParser.json());
app.use(cors());

let data = [
    {
        email: 'abc@gmail.com',
        status: 'enabled',
        password: '123456',
        tasks: [
            { task: 'get running', priority: 'medium' },
            { task: 'get studying', priority: 'high' },
            { task: 'get eating', priority: 'low' },
            { task: 'get sleeping', priority: 'high' },
        ],
        notifications: [
            {role: 'admin', note:'hi user'},
            {role: 'admin', note: 'You have not completed your tasks'},
        ],
    },
];


app.get('/data', (req, res) => {
    const email = req.query.email;
    for (let i = 0; i < data.length; i++) {
        if (data[i].email === email) {
            res.json(data[i]);
            break;
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
});

app.get('/all-data', (req, res) => {
    res.json(data);
});

app.delete('/tasks/:taskcontent', (req, res) => {
    const taskcontent = req.params.taskcontent;
  
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].tasks.length; j++) {
        if (data[i].tasks[j].task === taskcontent) {
          const index = data[i].tasks.findIndex((task) => task.task === taskcontent);
          if (index !== -1) {
            data[i].tasks.splice(index, 1);
            res.json({ message: 'Task Deleted Successfully' });
            break;
          }
        }
      }
    }
  });

app.put('/update', (req, res) => {
    const email = req.body.email
    const updation = req.body.status;
    console.log(email, ', ', updation);
    for (let i = 0; i < data.length; i++) {
        if (data[i].email === email) {
            data[i].status = updation;
            console.log('Status Updated successfully: ', data[i].status);
            break;
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
});

app.post('/add-notification', (req, res) => {
    const { email, data: newNotification } = req.body;
  
    for (let i = 0; i < data.length; i++) {
      if (data[i].email === email) {
        data[i].notifications.push(newNotification);
        res.send('Notification added successfully.');
        break;
      }
    }
  });

  app.post('/add-task', (req, res) => {
    const { email, data: newTask } = req.body;
    console.log(email, "\t", newTask);
    for (let i = 0; i < data.length; i++) {
      if (data[i].email === email) {
        data[i].tasks.push(newTask);
        res.send('Notification added successfully.');
        break;
      }
    }
  });

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});