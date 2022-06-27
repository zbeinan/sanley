<?php	
	if (empty($_POST['name_33088']) && strlen($_POST['name_33088']) == 0 || empty($_POST['email_33088']) && strlen($_POST['email_33088']) == 0 || empty($_POST['email_33088']) && strlen($_POST['email_33088']) == 0 || empty($_POST['message_33088']) && strlen($_POST['message_33088']) == 0)
	{
		return false;
	}
	
	$name_33088 = $_POST['name_33088'];
	$email_33088 = $_POST['email_33088'];
	$email_33088 = $_POST['email_33088'];
	$message_33088 = $_POST['message_33088'];
	$optin_33088 = $_POST['optin_33088'];
	
	$to = 'receiver@yoursite.com'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "Message from a Blocs website.";
	$email_body = "You have received a new message. \n\n".
				  "Name_33088: $name_33088 \nEmail_33088: $email_33088 \nEmail_33088: $email_33088 \nMessage_33088: $message_33088 \nOptin_33088: $optin_33088 \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\r\n";
	$headers .= "Reply-To: $email_33088";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>