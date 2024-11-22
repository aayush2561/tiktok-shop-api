import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const generateSignature = (data, secretKey) => {
  const message = `total_amount=${data.total_amount},transaction_uuid=${data.transaction_uuid},product_code=${data.product_code}`;
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return hashInBase64;
};

const initiatePayment = async (orderData, secretKey) => {
  const transaction_uuid = uuidv4();
  const success_url = process.env.ESEWA_SUCESS_URL;
  const failure_url = process.env.ESEWA_FAILURE_URL;
  const product_code = process.env.ESEWA_PRODUCT_CODE;
  const signed_field_names = process.env.ESEWA_SIGNED_FIELDNAMES;

  const requestData = {
    amount: orderData.totalamount,
    tax_amount: 0,
    total_amount: orderData.totalamount,
    transaction_uuid: transaction_uuid,
    product_code: product_code,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: success_url,
    failure_url: failure_url,
    signed_field_names: signed_field_names,
    signature: signature,
  };

  const signature = generateSignature(requestData, secretKey);
  requestData.signature = signature;

  try {
    const response = await axios.post(
      'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
      null,
      { params: requestData }
    );

    if (response.status === 200) {
      orderData.paymentStatus = 'Successful';
      return { success: true, data: response.data };
    } else {
      orderData.paymentStatus = 'Failed';
      return { success: false, error: 'Error in payment request' };
    }
  } catch (error) {
    console.error('Error making request to eSewa:', error);
    return { success: false, error: error.message };
  }
};

export default initiatePayment;
