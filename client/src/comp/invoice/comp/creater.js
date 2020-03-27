import React, { useState } from 'react';
import { connect } from 'react-redux';
import InvoiceContainer from './invoiceContainer.js';
import axios from 'axios';
import { saveAs } from 'file-saver';
//import PropTypes from "prop-types";

const Creater = () => {
	const [state, setState] = useState({
		order_id: '',
		items: [],
		invoice_id: '',
		currency: '',
		data: [],
		loaded: false
	});

	const { order_id } = state;

	const onChange = async e => {
		setState({ ...state, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		let res = await axios.get(
			`http://tools.raminternet.com/devotion/api/getProformaInfo/?id=${order_id}&token=n9VTU1yvRomDHZOBfTt0aKEMlSmzO9Na`
		)
		res = res.data;
		if (res.status == 'success') {
			console.log(res.data.items)
			let items = await res.data.items.map(item => ({ ...item, 'invoice_id': res.data.invoice_id, 'amount': item.amount.replace(',', '') }));
			console.log(items)
			await setState({
				...state,
				loaded: true,
				invoice_id: res.data.invoice_id,
				currency: res.data.currency,
				issue_date: res.data.issue_date,
				customer_address: res.data.customer_address,
				delivery_address: res.data.delivery_address,
				payment_reference: res.data.payment_reference,
				items: items
			});
		}
	};

	const onSave = () => {
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
		axios.post('/api/invoice', body);
		window.location.href = "http://localhost:3000/invoice";
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
		await axios.post('/api/invoice/', body);
		console.log(state.invoice_id)
		await axios
			.get('/api/invoice/pdf/' + state.invoice_id, {
				responseType: 'arraybuffer',
				headers: { Accept: 'application/pdf' }
			})
			.then(res => {
				const blob = new Blob([res.data], { type: 'application/pdf' });
				saveAs(blob, `devotion_proforma_${order_id}.pdf`);
			});
			window.location.href = "http://localhost:3000/invoice";
	};

	return (
		<div className='creator-container'>
			<div className='creator-title'>Create Invoice</div>
			<div className='order-input'>
				<form className='creater-form' onSubmit={e => onSubmit(e)}>
				<div className='input-container'>
				<label className='label' for='order_id'>Order ID</label>
					<input
						type='text'
						className='input creator-input'
						name='order_id'
						id='order_id'
						value={order_id}
						onChange={e => onChange(e)}
					/>
					<input type='submit' className='input btn btn-creator' value='Get' />
				</div>
				</form>
			</div>
			<div className='invoice-container'>
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
		</div>
	);
};
Creater.prototype = {};

//const mapStateToProps = state => ({});

export default connect()(Creater);
