import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  GridColumn
} from 'semantic-ui-react'

import { deleteContact, getMyContacts, availableContact, updateContact } from '../api/contacts-api'
import Auth from '../auth/Auth'
import { Contact } from '../types/Contact'

interface MyContactsProps {
  auth: Auth
  history: History
}

interface MyContactsState {
  contacts: Contact[]
  loadingContacts: boolean
}

export class MyContacts extends React.PureComponent<MyContactsProps, MyContactsState> {
  state: MyContactsState = {
    contacts: [],
    loadingContacts: true
  }

  onEditButtonClick = (contactId: string) => {
    this.props.history.push(`/contacts/${contactId}/edit`)
  }

  onContactDelete = async (contactId: string) => {
    try {
      await deleteContact(this.props.auth.getIdToken(), contactId)
      this.setState({
        contacts: this.state.contacts.filter((contact) => contact.contactId != contactId)
      })
      alert(`Contact is removed successfully.`)
    } catch {
      alert('Contact deletion failed')
    }
  }

  
  handleFieldChange(event: React.ChangeEvent<HTMLInputElement>, contact: any, pos: any, whichField:string) {
    console.log('new val: ' + event.target.value)
    
    if(whichField === 'name')
      this.state.contacts[pos].name = event.target.value;
    
    if(whichField === 'desc')
      this.state.contacts[pos].description = event.target.value;

    if(whichField === 'phone')
      this.state.contacts[pos].phone = event.target.value;

    if(whichField === 'address')
      this.state.contacts[pos].address = event.target.value;  
  }
  
  onSaveChang = async (contactId: string, pos: number) => {
    try {
      const contact = this.state.contacts[pos]
      await updateContact(this.props.auth.getIdToken(), contactId, contact.name, contact.description, contact.address, contact.phone)
      
      alert('Update Successful')
    } catch {
      alert('Contact update failed')
    }
  }

  onAvailableButtonClick = async (contactId: string, pos: number) => {
    try {
      const contact = this.state.contacts[pos]
      await availableContact(this.props.auth.getIdToken(), contactId)
      alert(`${contact.name} is now visible in your contacts.`)
      const contacts = this.state.contacts.map((contact) => {
        if (contact.contactId === contactId) {
          contact.available = 'true'
        }
        return contact
      })
      this.setState({
        contacts
      })
    } catch {
      alert('Make Contact visible failed')
    }
  }

  onContactCreate = async () => {
    this.props.history.push(`/contacts/create`)
  }

  async componentDidMount() {
    try {
      const contacts = await getMyContacts(this.props.auth.getIdToken())
      this.setState({
        contacts,
        loadingContacts: false
      })
    } catch (e) {
      alert(`Failed to fetch contacts: ${JSON.stringify(e)}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h4">Manage Your Contact List</Header>
        <Header as="h6"><u>* Name, Description, Phone and Address can be modified</u></Header>
        {/* {this.renderCreateContactInput()}  */}

        {this.renderContacts()}
      </div>
    )
  }

  renderCreateContactInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button color="teal" onClick={this.onContactCreate}>
            Add New Contact
          </Button> 
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
          <Header as="h6"><u>* Name, Description, Phone and Address can be modified</u></Header>
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderContacts() {
    if (this.state.loadingContacts) {
      return this.renderLoading()
    }

    return this.renderContactsList()
    // return this.renderContactsTest()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Contacts
        </Loader>
      </Grid.Row>
    )
  }



  renderContactsList() {
    return (
      <Grid padded>
        <Grid.Row >
        <Grid.Column width={1} floated="right">Name</Grid.Column>
        <Grid.Column width={2} floated="right">Description</Grid.Column>
        <Grid.Column width={2} floated="right">Phone Number</Grid.Column>
        <Grid.Column width={2} floated="right">Address</Grid.Column>
        <Grid.Column width={1} floated="right"> </Grid.Column>
        <Grid.Column width={2} floated="right">Save Changes</Grid.Column>
        <Grid.Column width={2} floated="right">Show/Hide</Grid.Column>
        <Grid.Column width={1} floated="right">Upload Pic</Grid.Column>
        <Grid.Column width={1} floated="right">Remove</Grid.Column>
        </Grid.Row>
        {this.state.contacts.map((contact, pos) => {
          return (
            <Grid.Row key={contact.contactId}>
              <Grid.Column width={1}>
                <input type="text" width="90%"
                  defaultValue={contact.name} 
                  onChange={(e) => this.handleFieldChange(e, contact, pos, 'name')}
                />
              </Grid.Column>1
                                    
              <Grid.Column width={2} floated="right">
                <input type="text"
                  defaultValue={contact.description}
                  onChange={(e) => this.handleFieldChange(e, contact, pos, 'desc')} 
                /> 
              </Grid.Column>2
              
                          
              <Grid.Column width={2} floated="right">
                <input type="text"
                  defaultValue={contact.phone}
                  onChange={(e) => this.handleFieldChange(e, contact, pos, 'phone')}
                />
              </Grid.Column>
              {/* <Grid.Column width={1} floated="right">&nbsp;</Grid.Column>             */}
              
              <Grid.Column width={2} floated="right">
                <input type="text"
                  defaultValue={contact.address}
                  onChange={(e) => this.handleFieldChange(e, contact, pos, 'address')}
                />
              </Grid.Column>
              <Grid.Column width={1} floated="right"> </Grid.Column>
                           
              <Grid.Column width={2} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onSaveChang(contact.contactId, pos)}
                >
                  Save Changes
                </Button>
              </Grid.Column>

              <Grid.Column width={2} floated="right">
                {contact.available === 'false' && (
                  <Button
                    icon
                    color="green"
                    onClick={() => this.onAvailableButtonClick(contact.contactId, pos)}
                  >
                    Activate
                  </Button>
                )}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(contact.contactId)}
                >
                  <Icon name="photo" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onContactDelete(contact.contactId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <GridColumn width={4} floated="left">
                {contact.attachmentUrl && (
                  <Image src={contact.attachmentUrl} size="small" wrapped />
                )}
              </GridColumn>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
