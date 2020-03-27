import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Creater from './comp/creater';
import Table from './comp/table';
import Editor from './comp/editor';

const Invoice = () => {
	return (
		<div>

			<div className='main-container'>
				<Switch>
					<Route path='/invoice/editor/:id' component={Editor} />
					<Route path='/creater' component={Creater} />
					<Route exact path='/invoice' component={Table} />
				</Switch>
			</div>
		</div>
	);
};

Invoice.prototype = {};

export default connect()(Invoice);
