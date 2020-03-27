import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import InvoiceContainer from './invoiceContainer.js';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Editor = props => {
	const [state, setState] = useState({
		order_id: '',
		items: [],
		invoice_id: '',
		currency: '',
		data: [],
		loaded: false,
		loading: true,
	});

	const { order_id } = state;


	const onChange = async e => {
		setState({ ...state, [e.target.name]: e.target.value });
	};

	const loader = () => {
		let id = props.match.params.id;
		axios.get(`/api/invoice/${id}`).then(res => {
			console.log(res)
			setState({
				...state,
				loading: false,
				loaded: true,
				order_id: res.data.order_id,
				invoice_id: res.data.invoice_id,
				currency: res.data.currency,
				issue_date: res.data.issue_date,
				customer_address: res.data.customer_address,
				delivery_address: res.data.delivery_address,
				payment_reference: res.data.payment_reference
			});
		});
	};

	const onSave = () => {
		let body = {
			invoice_id: state.invoice_id,
			order_id: state.order_id,
			currency: state.currency,
			issue_date: state.issue_date,
			customer_address: state.customer_address,
			delivery_address: state.delivery_address,
			payment_reference: state.payment_reference
		};
		axios.put(`/api/invoice/${state.invoice_id}`, body);
	};

	const onSaveAndDownload = async () => {
		let body = {
			invoice_id: state.invoice_id,
			order_id: state.order_id,
			currency: state.currency,
			issue_date: state.issue_date,
			customer_address: state.customer_address,
			delivery_address: state.delivery_address,
			payment_reference: state.payment_reference,
			items: state.items
		};
		await axios.put(`/api/invoice/${state.invoice_id}`, body);
		await axios
			.get('/api/invoice/pdf/' + state.invoice_id, {
				responseType: 'arraybuffer',
				headers: { Accept: 'application/pdf' }
			})
			.then(res => {
				const blob = new Blob([res.data], { type: 'application/pdf' });
				saveAs(blob, `pdf${state.order_id}.pdf`);
			});
	};

	return (
		<div className='creater-container'>
		<div className='creator-title'>Editor</div>
			
			<Fragment>
				{state.loading ? (
					<Fragment>
					<p>
					{loader()}
						Загрузка...
					</p>
					</Fragment>
				) : (
					<Fragment>
						<div>
							<InvoiceContainer
					loading={state.loaded}
					invoice_id={state.invoice_id}
					currency={state.currency}
					issue_date={state.issue_date}
					customer_address={state.customer_address}
					delivery_address={state.delivery_address}
					payment_reference={state.payment_reference}
					onChange={onChange}
					onSave={onSave}
					onSaveAndDownload={onSaveAndDownload}
							/>
						</div>
					</Fragment>
				)}
			</Fragment>
		</div>
	);
};
Editor.prototype = {};

export default connect()(Editor);
