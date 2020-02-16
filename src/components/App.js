import React, { Component } from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { RemindersList } from './RemindersList';
import { ClearAllButton } from './ClearAllButton';
import { ClearDoneButton } from './ClearDoneButton';
import { Filter } from './Filter';
import { Button,Tabs ,Icon, Modal, Input} from 'antd';
import 'antd/dist/antd.css';
import { 
    addReminder, 
    deleteReminder, 
    clearReminders, 
    toggleIsEditingRow,
    editReminderText,
    doneReminder,
    clearDoneReminders,
    changeCurrentFilter
} from '../actions';
const { TabPane } = Tabs;

    
class App extends Component {
    state = { visible: false };
  
    showModal = () => {
      this.setState({
        visible: true,
      });
    };
  
    handleOk = s => {
      console.log(s);
      this.setState({
        visible: false,
      });
    };
  
    handleCancel = s => {
      console.log(s);
      this.setState({
        visible: false,
      });
    };
   
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            act: 0,
            index: '',
            datas: []
        };
        this.addCheckActive = this.addCheckActive.bind(this);
    }
 
    addReminder (e) {
        if(moment(this.timeInput.value).isBefore(Date.now())) {
            alert('No dates in the past are allowed!');
            this.timeInput.value = moment().add(1, 'm').format('YYYY-MM-DDTHH:mm');
        } else {
            this.props.addReminder(
                this.taskInput.value,
                moment(this.timeInput.value).toDate()
            );
            this.taskInput.value = '';
            this.setState({disabled: true});
        }
    }

    deleteReminder (id) {
        this.props.deleteReminder(id);
    }

    addCheckActive() {
        const newValue = this.taskInput.value;
        if (newValue > '' && this.state.disabled)
            this.setState({disabled: false});
        else if (!newValue && !this.state.disabled)
            this.setState({disabled: true});
    }

    fSubmit = (j) =>{
        j.preventDefault();
        console.log('try');
    
        let datas = this.state.datas;
        let name1 = this.refs.name1.value;
        let email = this.refs.email.value;
    
        if(this.state.act === 0){   //new
          let data = {
            name1, email
          }
          datas.push(data);
        }else{                      //update
          let index = this.state.index;
          datas[index].name1 = datas.name1;
          datas[index].email = email;
        }    
    
        this.setState({
          datas: datas,
          act: 0
        });
    
        this.refs.myForm.reset();
        this.refs.name1.focus();
      }
    
      fRemove = (i) => {
        let datas = this.state.datas;
        datas.splice(i,1);
        this.setState({
          datas: datas
        });
    
        this.refs.myForm.reset();
        this.refs.name1.focus();
      }
    
      fEdit = (i) => {
        let data = this.state.datas[i];
        this.refs.name1.value = data.name1;
        this.refs.email.value = data.email;
    
        this.setState({
          act: 1,
          index: i
        });
    
        this.refs.name1.focus();
      }  

    render() {
        let datas = this.state.datas;
        return (
            <div className="App">
                <Tabs defaultActiveKey="2">
    <TabPane
      tab={
        <span>
          <Icon type="apple" />
         To Do
        </span>
      }
      key="1"
    >
      <div className='filter-group'>
                    <div className="reminders-number">
                        <h4>{this.props.reminders.length} todos left</h4>
                    </div>
                    <Filter 
                        changeCurrentFilter={this.props.changeCurrentFilter}
                    />
                </div>
                <div className="form-inline reminder-form">
                    <div className="form-group">
                        <input
                            className="form-control"
                            placeholder="I have to…"
                            ref={(c) => { this.taskInput = c; }}
                            onChange={this.addCheckActive}
                        />
                        <input
                            className="form-control"
                            type="datetime-local"
                            defaultValue={moment().add(1, 'm').format('YYYY-MM-DDTHH:mm')}
                            ref={(c) => { this.timeInput = c; }}
                        />
                        <Button
                            className="btn btn-success"
                            type="button"
                            onClick={(e) => this.addReminder(e)}
                            disabled={this.state.disabled}
                        >
                        Add todo</Button>
                    </div>
                    <RemindersList
                        reminders={this.props.reminders}
                        deleteReminder={this.props.deleteReminder}
                        toggleIsEditingRow={this.props.toggleIsEditingRow}
                        isEditing={this.props.isEditing}
                        editReminderText={this.props.editReminderText}
                        doneReminder={this.props.doneReminder}
                        currentFilter={this.props.currentFilter}
                    />
                    <ClearAllButton 
                        reminders={this.props.reminders}
                        clearReminders={this.props.clearReminders}
                    />
                    <ClearDoneButton 
                        reminders={this.props.reminders}
                        clearDoneReminders={this.props.clearDoneReminders}
                    />
                </div>
    </TabPane>
    <TabPane
      tab={
        <span>
          <Icon type="android" />
         Create User
        </span>
      }
      key="2"
    >
    <div>
        <Button type="primary" onClick={this.showModal}>
          Create User
        </Button>
        <Modal
          title="Create User"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          
      <form ref="myForm" className="myForm">
          <input type="text" ref="name1" placeholder="your name" className="formField" />
          <input type="text" ref="email" placeholder="your email" className="formField" />
          <Button type="primary" onClick={(j)=>this.fSubmit(j)} className="myButton">submit </Button>
        </form>
        </Modal>
      </div>
      <div>
      <br/>
      <table>
  <tr>
    <th>ID</th>
    <th>Firstname</th>
    <th>Email</th>
<th>Remove</th>
<th>Edit</th>
  </tr>
    
          {datas.map((data, i) =>
            <tr key={i} className="myList">
      

    <td>{i+1}</td>
    <td>{data.name1}</td>
    <td>{data.email}</td>
<td><Button onClick={()=>this.fRemove(i)} className="myListButton">Remove </Button></td>
<td>  <Button onClick={()=>this.fEdit(i)} className="myListButton">Edit </Button>
          </td> </tr>
  

          )}
        
        </table> 
          </div>
    </TabPane>
  </Tabs>
                
            </div>
        );
    }
}

export default connect((state) => ({
    reminders: state.reminders,
    currentFilter: state.currentFilter
}), { 
        addReminder, 
        deleteReminder, 
        clearReminders, 
        toggleIsEditingRow,
        editReminderText,
        doneReminder,
        clearDoneReminders,
        changeCurrentFilter
    }
)(App);