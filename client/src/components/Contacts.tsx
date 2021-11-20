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
  Loader
} from 'semantic-ui-react'
import { getAvailableContacts, hideContact } from '../api/contacts-api'
import Auth from '../auth/Auth'
import { Contact } from '../types/Contact'

interface ContactsProps {
  auth: Auth
  history: History
}

interface ContactsState {
  contacts: Contact[]
  loadingContacts: boolean
}

export class Contacts extends React.PureComponent<ContactsProps, ContactsState> {
  state: ContactsState = {
    contacts: [],
    loadingContacts: true
  }

  onWalkButtonClick = async (contactId: string, userId: string) => {
    try {
      await hideContact(this.props.auth.getIdToken(), contactId, userId)
      alert('This will hide the contact. You can make it visible by going to edit contacts.')
      this.setState({
        contacts: this.state.contacts.filter((contact) => contact.contactId !== contactId)
      })
    } catch {
      alert('Action failed')
    }
  }

  async componentDidMount() {
    try {
      const contacts = await getAvailableContacts(this.props.auth.getIdToken())
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
        <Header as="h4">
          My Contacts
        </Header>

        {this.renderContacts()}
      </div>
    )
  }

  renderContacts() {
    if (this.state.loadingContacts) {
      return this.renderLoading()
    }

    return this.renderContactsList()
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
        {this.state.contacts.map((contact, pos) => {
          return (
            <Grid.Row key={contact.contactId}>
              <Grid.Column width={3}>{contact.name}</Grid.Column>
              <Grid.Column width={3} floated="right">
                {contact.description}
              </Grid.Column>

              <Grid.Column width={3}>{contact.phone}</Grid.Column>
              <Grid.Column width={3}>{contact.address}</Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onWalkButtonClick(contact.contactId, contact.userId)}
                >
                  Hide
                </Button>
              </Grid.Column>
              <Grid.Column width={4} floated="left">
                {contact.attachmentUrl && (
                  <Image src={contact.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>




              {/* {contact.attachmentUrl && (
                <Image src={contact.attachmentUrl} size="small" wrapped />
              )} */}
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
