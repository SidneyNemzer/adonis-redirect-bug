'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      // These two fields uniquely identify a user amoung all providers
      table.string('provider').notNullable()
      table.string('provider_id').notNullable()
      
      table.string('name', 80).nullable()
      table.string('email', 254).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
