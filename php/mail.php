<?php
  require 'class.phpmailer.php';
  $mail = new PHPMailer;

  $mail->setFrom('no-reply@direct-all-in.ru', 'Direct All-in');
  $mail->addAddress('admin@z-gu.ru');
  // $mail->addBCC('bcc@example.com');
  $mail->isHTML(true);
  if (isset($_POST['subject'])) {
    $mail->Subject = $_POST['subject'];
  } else {
    $mail->Subject = 'Завявка на обучение';
  }
  $mail->Body = 'This is the HTML message body <b>in bold!</b>';
  $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

  if(!$mail->send()) {
      echo 'Message could not be sent.';
      echo 'Mailer Error: ' . $mail->ErrorInfo;
  } else {
      echo 'Message has been sent';
  }
?>
