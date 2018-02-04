import React, { Component } from 'react';
import { Menu, Grid, Sidebar, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ScoreForm from '../components/scoreForm/ScoreForm';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import FourOFour from '../components/404';
import ScoreSheet from '../components/ScoreSheet';
import Rules from '../components/Rules';
import ProfileForm from '../components/ProfileForm';
import HeadToHead from '../components/HeadToHead';
import LeagueScoreSheet from '../components/LeagueScoreSheet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { conf } from '../App';
import { Auth } from '../actions';


class MenuHeader extends Component {
	constructor(props) {
		super(props);

		conf.onNetworkError = () => {
			this.doRoute(LOGIN_PATH);
			this.props.logout();
		};

		// primt the pump
		fetch('/api')
			.then(res => res.json())
			.catch(conf.onNetworkError);


		// attempt to properly set the activeItem based on the current page
		this.state = {
			//activeItem: 'score form', // original default
			activeItem: props.location.pathname,
			visible: false,
			dimmed: false
		}


	}

	toggleMobileMenu = activeMenu => {
		if (activeMenu || (!activeMenu && this.state.visible && this.state.dimmed)) {
			this.setState({ visible:!this.state.visible, dimmed: !this.state.dimmed})
		}
	}

	handleItemClick = (e, { name, to }) => {
		this.doRoute(to);
	}

	doRoute = (to) => {
		this.props.history.push(to);
		this.setState({ activeItem: to, visible: false, dimmed: false });
	}

	render () {
		const { activeItem, visible, dimmed } = this.state

		return (
			<Grid>
				<Grid.Row only='computer'>
					<Grid.Column>
						<Menu color='blue' inverted pointing secondary>
							<Menu.Item header	name='Fantasy Fitness' />
							<MenuItemsRouting activeItem={activeItem} handleItemClick={this.handleItemClick} mobile={false} isLoggedIn={this.props.loggedIn} />
						</Menu>
						<RoutingPaths />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row only='tablet mobile'>
					<Grid.Column>
						<Sidebar.Pushable>
							<Sidebar
								as={Menu}
								animation='overlay'
								width='very wide'
								visible={visible}
								vertical
								inverted
							>
								<MenuItemsRouting
									activeItem={activeItem}
									handleItemClick={this.handleItemClick}
									mobile={true}
									handleToggleMobileMenu={this.toggleMobileMenu}
									style={{padding: '20px', fontSize: '1em'}}/>
							</Sidebar>
							<Sidebar.Pusher onClick={() => this.toggleMobileMenu(false)} dimmed={dimmed} >
								<Menu color='blue' inverted>
									<Menu.Item header name='Fantasy Fitness' />
									<Menu.Menu position='right'>
										<Menu.Item onClick={() => this.toggleMobileMenu(true)}>
											<Icon name='sidebar' />
										</Menu.Item>
									</Menu.Menu>
								</Menu>
								<RoutingPaths />
							</Sidebar.Pusher>
						</Sidebar.Pushable>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}


const LOGIN_PATH = '/login';

const menuItems = [
	{
		path: '/score',
		name: 'Score',
		displayName: 'Score'
	},

	{
		path: '/scoresheet',
		name: 'score sheet',
		displayName: 'Score Sheet'
	},

	{
		path: '/league',
		name: 'league',
		displayName: 'League'
	},

	{
		path: '/matchups',
		name: 'matchups',
		displayName: 'Matchups'
	},

	{
		path: '/rules',
		name: 'rules',
		displayName: 'Rules'
	},

	{
		path: '/profile',
		name: 'profile',
		displayName: 'Profile'
	},
];


const loginMenuItem = {
	path: LOGIN_PATH,
	name: 'login',
	displayName: 'Login'
};

const logoutMenuItem = {
	path: '/logout',
	name: 'logout',
	displayName: 'Logout'
};


const MenuItemsRouting = ({activeItem, handleItemClick, mobile, handleToggleMobileMenu, style, isLoggedIn}) => (
	<Menu.Menu position='right'>
		{mobile &&
				<Menu.Item onClick={() => handleToggleMobileMenu(true)} style={{padding: '15px', marginBottom: '15px'}}>
					Close
					<Icon name='remove' />
				</Menu.Item>
		}

		{/* using index is silly here and will result in problems if ever we make menu items dynamic */}
		{menuItems.map((menuItem, index) => renderMenuItem({ activeItem, handleItemClick, mobile, style, menuItem }))}
		{renderSignupMenuItem({ activeItem, handleItemClick, mobile, style, isLoggedIn })}

	</Menu.Menu>
)

const renderSignupMenuItem = ({ activeItem, handleItemClick, mobile, style, isLoggedIn }) => {
	let menuItem = (isLoggedIn ? logoutMenuItem : loginMenuItem);
	return renderMenuItem({ activeItem, handleItemClick, mobile, style, menuItem });
}

const renderMenuItem = ({ activeItem, handleItemClick, mobile, style, menuItem }) => {
	return (
		<Menu.Item to={menuItem.path}
			name={menuItem.name}
			active={activeItem === menuItem.path}
			onClick={handleItemClick}
			style={style}>
			{menuItem.displayName}
		</Menu.Item>
	)
}


const RoutingPaths = () => (
	<Switch>
		<Route exact path='/score' render={() => <ScoreForm />} />
		<Route exact path='/scoresheet' render={() => <ScoreSheet />} />
		<Route exact path='/league' render={() => <LeagueScoreSheet />} />
		<Route path='/login' render={() => <Login />} />
		<Route path='/signup' render={() => <SignUp />} />

		<Route path='/matchups' render={() => <HeadToHead />} />
		<Route path='/profile' render={() => <ProfileForm />} />
		<Route path='/rules' component={Rules} />
		<Route path='/404' component={FourOFour} />
		<Redirect to='/scoresheet' />
	</Switch>
)


const mapStateToProps = (state) => {
	return { ...state.auth };
}

const mapDispatchToProps = (dispatch) => {
	const { logout } = Auth;
	return bindActionCreators({ logout }, dispatch);
}


// withRouter injects history props to trigger routing
//export default withRouter(MenuHeader);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MenuHeader));
