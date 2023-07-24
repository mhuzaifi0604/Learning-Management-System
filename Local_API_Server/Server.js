const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 6969;
app.use(bodyParser.json());
app.use(cors());

let data = {
    email: 'abc@gmail.com',
    status: 'enabled',
    tasks:[
        {task: 'get running', priority: 'medium'},
        {task: 'get studying', priority: 'high'},
        {task: 'get eating', priority: 'low'},
        {task: 'get sleeping', priority: 'high'},
    ],
    notifications:[
        'Hi User',
        `You have not completed your tasks`
    ],
};

app.get('/data', (req, res)=>{
    res.json(data);
});

app.delete('/tasks/:taskcontent',(req, res) =>{
    const taskcontent = req.params.taskcontent;
    console.log('Task content received in DELETE request:', taskcontent);
    const index = data.tasks.findIndex((task) => task.task === taskcontent);
    if (index === -1 ){
        return res.status(200).json({message: 'Task Not in array'});
    }
    data.tasks.splice(index, 1);
    res.json({message: 'Task Deleted Successfully'});
});

 app.listen(port, ()=>{
    console.log(`Server Running on http://localhost:${port}`);
 });