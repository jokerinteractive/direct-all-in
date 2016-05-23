<?php
  //заменить на нужное
  $to = 'doyoulikeorigami@gmail.com';
  $theme = 'Завявка на обучение';
  $message = "Имя клиента " . $_POST['name'] . "<br>";
  $message .= "Телефон клиента" . $_POST['phone'] . "<br>";

  mail($to, $theme, $message);
?>
