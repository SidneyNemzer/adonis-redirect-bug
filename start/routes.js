'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const User = use('App/Models/User')

Route.get('/', ({ session, view }) => {
  console.log('GET /')
  console.log('Session:', session.all())
  return view.render('welcome')
})

Route.get('/authenticate/:provider', async ({ ally, params }) => {
  console.log('Redirecting for login...')
  await ally.driver(params.provider).redirect()
})

Route.get('/authenticated/:provider', async ({ ally, params, auth, session, response, view }) => {
  console.log('Handling auth callback')
  const { provider } = params

  const allyUser = await ally.driver(provider).getUser()
  const user = await User.query().where({
    'provider': provider,
    'provider_id': allyUser.getId()
  }).first()

  if (user) {
    console.log('Returning user has logged in')
    await auth.login(user)
  } else {
    console.log('New user has logged in')
    const user = new User()
    user.provider = provider
    user.provider_id = allyUser.getId()
    user.name = allyUser.getName()
    user.email = allyUser.getEmail()

    await user.save()

    await auth.login(user)
  }

  console.log('Session:', session.all())

  // To fix, comment out the following line
  return response.redirect('/check-auth')
  // And uncomment this next line
  // return view.render('redirect', { url: '/check-auth' })
})

Route.get('/logout', async ({ auth, response }) => {
  await auth.logout()
  response.redirect('/')
})

Route.on('/check-auth').render('check-auth')
