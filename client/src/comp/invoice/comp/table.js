import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Moment from 'react-moment';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Table = () => {
	const [state, setState] = useState({
		invoices: [],
		loading: true,
		redirect: false,
		focus: ''
	});

	const InvoiceTable = () => {
		axios.get('/api/invoice').then(res => {
			setState({ ...state, invoices: res.data, loading: false });
		});
	};
	const editorTable = invoice_id => {
		setState({ ...state, redirect: true, focus: invoice_id });
	};
	const renderRedirect = () => {
		if (state.redirect)
			return <Redirect to={`/invoice/editor/${state.focus}`} />;
	};
	const deleteTable = invoice_id => {
		axios.delete(`/api/invoice/${invoice_id}`);
	};
	const downloadTable = (invoice_id, order_id) => {
		axios
		.get('/api/invoice/pdf/' + invoice_id, {
			responseType: 'arraybuffer',
			headers: { Accept: 'application/pdf' }
		})
		.then(res => {
			const blob = new Blob([res.data], { type: 'application/pdf' });
			saveAs(blob, `devotion_proforma_${order_id}.pdf`);
		});
	};

	return (
		<div className='table-container'>
			{InvoiceTable()}
			{renderRedirect()}
			<Fragment>
				{state.loading ? (
					<p>Загрузка...</p>
				) : (
					<Fragment>
						<div className='outsider'>
									<div className='invoice-panel-title'>Invoice panel</div>
			<Link to='/creater'><div className='btn btn-create'>Create an invoice</div></Link>
			</div>
						<div className='table-header'>
							<div className='table-col-name'>Invoice id</div>
							<div className='table-col-name'>Order id</div>
							<div className='table-col-name'>Date</div>
						</div>

						{state.invoices.map(item => (
							<div className='table-item' key={item._id}>
								<div className='table-col'>{item.invoice_id}</div>
								<div className='table-col'>{item.order_id}</div>
								<div className='table-col'>
									<Moment format="DD.MM.YY ">
                	{item.created_at}
									</Moment>
								</div>
								
								<div className='btn table-btn delete-btn' onClick={() => deleteTable(item.invoice_id)}>Delete</div>
								<div className='btn table-btn download-btn' onClick={() => downloadTable(item.invoice_id, item.order_id)}>
									Download
								</div>
								
								<div className='btn table-btn edit-btn' onClick={() => editorTable(item.invoice_id)}>Edit</div>
							</div>
						))}
					</Fragment>
				)}
			</Fragment>
		</div>
	);
};
Table.prototype = {};

export default connect()(Table);
