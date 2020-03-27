import React from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

const InvoiceContainer = props => {
	const {
		invoice_id,
		loading,
		currency,
		payment_reference,
		issue_date,
		customer_address,
		delivery_address
	} = props;

	const onChange = async e => {
		props.onChange(e);
	};

	const onSave = () => {
		props.onSave();
	};

	const onSaveAndDownload = () => {
		props.onSaveAndDownload();
	};

	const InvoicePrototype = () => {
		console.log(props)
		if (loading) {
			return (
				<div>
					<form className='proto-form'>
						<div className='input-container'>
						<label className='label' htmlFor="invoice_id">Invoice ID</label>
						<input
							type='text'
							className='input proto-input'
							name='invoice_id'
							id='invoice_id'
							value={invoice_id}
							onChange={e => onChange(e)}
						/>
						</div>
						
						<br />
						<div className='input-container'>
						<label className='label' htmlFor='currency'>Currency</label>
						<input
							type='text'
							className='input proto-input'
							name='currency'
							id='currency'
							value={currency}
							onChange={e => onChange(e)}
						/>
						</div>

						<br />
						<div className='input-container'>
						<label className='label' htmlFor='issue_date'>Issue date</label>
						<input
							type='text'
							className='input proto-input'
							name='issue_date'
							id='issue_date'
							value={issue_date}
							onChange={e => onChange(e)}
						/>
						</div>

						<br />
						<div className='input-container'>
						<label className='label' htmlFor='payment_reference'>Payment reference</label>
						<input
							type='text'
							className='input proto-input'
							name='payment_reference'
							id='payment_reference'
							value={payment_reference}
							onChange={e => onChange(e)}
						/>
						</div>

						<br />
						<div className='input-container'>
						<label className='label-textarea' htmlFor='customer_address'>Customer Address</label>
						<textarea
							rows='7'
							cols='30'
							name='customer_address'
							id='customer_address'
							className='input proto-textarea'
							onChange={e => onChange(e)}
							defaultValue={customer_address}
							value={customer_address}
						>
							{customer_address}
						</textarea>
						</div>

						<br />
						<div className='input-container'>
						<label className='label-textarea' htmlFor='delivery_address'>Delivery Address</label>
						<textarea
							rows='7'
							cols='30'
							name='delivery_address'
							id='delivery_address'
							className='input proto-textarea'
							onChange={e => onChange(e)}
							defaultValue={delivery_address}
							value={delivery_address}
						>
							{delivery_address}
						</textarea>
						</div>

					</form>
					<div onClick={() => onSave()} className='btn btn-save'>
						Save
					</div>
					<div
						onClick={() => onSaveAndDownload()}
						className='btn btn-save-download'
					>
						Save & Download
					</div>
				</div>
			);
		}
	};

	return <div className='invoice-prototype'>{InvoicePrototype()}</div>;
};
InvoiceContainer.prototype = {};

export default connect()(InvoiceContainer);
