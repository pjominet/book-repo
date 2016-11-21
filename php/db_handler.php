<?php
/**
 * Created by PhpStorm.
 * User: Patrick Jominet
 * Date: 16.06.16
 * Time: 14:50
 */
$hostname = 'localhost';
$username = 'patrick';
$password = 'foobar123';
$dbName = 'patrick_bookshelf';


/** fetch data **/
try {
    $connection = new PDO("mysql:host=$hostname;dbname=$dbName;charset=utf8", $username, $password, array(
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

    $resultArray = array();
    $sql = "SELECT * FROM books";

    $statement = $connection->prepare($sql);
    $statement->execute();

    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
        $resultArray[] = $row;
    }
    $data = json_encode($resultArray);
    header("Content-type: application/json");
    echo $data;
} catch (PDOException $error) {
    echo $sql . "<br>" . $error->getMessage();
}
$connection = null;