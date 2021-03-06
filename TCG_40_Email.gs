// **********************************************
// function subGetEmailAddressSngl()
//
// This function gets the email addresses for a
// single player from the configuration file
//
// **********************************************

function subGetEmailAddressSngl(Player, shtPlayers, EmailAddresses){
  
  // Players Sheets for Email addresses
  var colEmail = 3;
  var NbPlayers = shtPlayers.getRange(2,1).getValue();
  var rowPlayer = 0;
  var PlyrRowStart = 3;
  
  var PlayerNames = shtPlayers.getRange(PlyrRowStart,2,NbPlayers,1).getValues();
  
  // Find Players rows
  for (var row = 0; row < NbPlayers; row++){
    if (PlayerNames[row] == Player) rowPlayer = row + PlyrRowStart;
    if (rowPlayer > 0) row = NbPlayers + 1;
  }
  
  // Get Email addresses using the players rows
  EmailAddresses[0] = shtPlayers.getRange(rowPlayer,colEmail+1).getValue();
  EmailAddresses[1] = shtPlayers.getRange(rowPlayer,colEmail).getValue();
    
  return EmailAddresses;
}

// **********************************************
// function subGetEmailAddressDbl()
//
// This function gets the email addresses for both
// players from the configuration file
//
// **********************************************

function subGetEmailAddressDbl(ss, Addresses, WinPlyr, LosPlyr){
  
  // Players Sheets for Email addresses
  var shtPlayers = ss.getSheetByName('Players');
  var colEmail = 3;
  var NbPlayers = shtPlayers.getRange(2,1).getValue();
  var rowWinr = 0;
  var rowLosr = 0;
  var PlyrRowStart = 3;
  
  var PlayerNames = shtPlayers.getRange(PlyrRowStart,2,NbPlayers,1).getValues();
  
  // Find Players rows
  for (var row = 0; row < NbPlayers; row++){
    if (PlayerNames[row] == WinPlyr) rowWinr = row + PlyrRowStart;
    if (PlayerNames[row] == LosPlyr) rowLosr = row + PlyrRowStart;
    if (rowWinr > 0 && rowLosr > 0) row = NbPlayers + 1;
  }
   
  // Get Email addresses using the players rows
  Addresses[1][0] = shtPlayers.getRange(rowWinr,colEmail+1).getValue(); // Language
  Addresses[1][1] = shtPlayers.getRange(rowWinr,colEmail).getValue();   // Email Address
  Addresses[2][0] = shtPlayers.getRange(rowLosr,colEmail+1).getValue(); // Language
  Addresses[2][1] = shtPlayers.getRange(rowLosr,colEmail).getValue();   // Email Address
    
  return Addresses;
}


// MATCH REPORT CONFIRMATION ----------------------------------------------------------------------------------------------------------

// **********************************************
// function fcnSendConfirmEmailEN()
//
// This function generates the confirmation email in English
// after a match report has been submitted
//
// **********************************************

function fcnSendConfirmEmailEN(shtConfig, Address, MatchData) {
  
  // Variables
  var EmailSubject;
  var EmailMessage;
  
  // Addresses and Languages for both players
  var Address1  = Address[1][1];
  var Language1 = Address[1][0];
  var Address2  = Address[2][1];
  var Language2 = Address[2][0];
  var AddressBCC;
  
  // Get Document URLs
  var UrlValues = shtConfig.getRange(17,2,3,1).getValues();
  var urlStandings = UrlValues[0][0];
  var urlCardList = UrlValues[1][0];
  var urlMatchReporter = UrlValues[2][0];
  
  // Facebook Page Link
  var urlFacebook = shtConfig.getRange(50, 2).getValue();
  
  // Open Email Templates
  var ssEmailID = shtConfig.getRange(47,2).getValue();
  var ssEmail = SpreadsheetApp.openById(ssEmailID);
  var shtEmailTemplates = ssEmail.getSheetByName('Templates');
  var Headers = shtEmailTemplates.getRange(3,2,29,1).getValues();
  
  // League Name
  var Location = shtConfig.getRange(11,2).getValue();
  var LeagueTypeEN = shtConfig.getRange(13,2).getValue();
  var LeagueNameEN = Location + ' ' + LeagueTypeEN;
  
  // Match Data Assignation
  var MatchID = MatchData[2][0];
  var Week    = MatchData[3][0];
  var Winr    = MatchData[4][0];
  var Losr    = MatchData[5][0];
  var PunishPack = 0;
  
  // Add Masterpiece mention if necessary
  if (MatchData[24][2] == 'Last Card is Masterpiece'){
    var Masterpiece = MatchData[23][2];
    MatchData[23][2] += ' (Masterpiece)' 
  }

  // Set Email Subject
  EmailSubject = LeagueNameEN + " - Week " + Week + " - Match Result" ;
    
  // Start of Email Message
  EmailMessage = '<html><body>';
  
  EmailMessage += 'Hi ' + Winr + ' and ' + Losr + ',<br><br>Your match result has been received and succesfully processed for the ' + LeagueNameEN + ', Week ' + Week + 
    '<br><br>Here is your match result:<br><br>';
    
  // Generate Match Data Table
  if (MatchData[9][0] != '') PunishPack = 1;
  EmailMessage = subMatchReportTable(EmailMessage, Headers, MatchData, PunishPack);
  
  // Add League Links
  EmailMessage += "<br>Click below to access the League Standings and Results:"+
    "<br>"+ urlStandings;
  EmailMessage += "<br><br>Click below to access your Card Pool:"+
    "<br>"+ urlCardList;
  EmailMessage += "<br><br>Click below to send another Match Report:"+
    "<br>"+ urlMatchReporter;
  
  // Add Facebook Page Link if present
  if(urlFacebook != ''){
    EmailMessage += "<br><br>Please join the Community Facebook page to chat with other players and plan matches.<br>" + urlFacebook;
  }
  
  // Add Signature
  EmailMessage += "<br><br>If you find any problems with your match result, please reply to this message and describe the situation as best you can. You will receive a response once it has been processed."+
    "<br><br>Thank you for using TCG Booster League Manager from Turn 1 Gaming Leagues & Tournaments";
  
  // End of Email Message
  EmailMessage += '</body></html>';
  
  // If both players share the same language
  if(Language1 == 'English' && Language2 == 'English'){
    AddressBCC = Address1 + ', ' + Address2;
    MailApp.sendEmail("", EmailSubject, "",{bcc:AddressBCC, name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
  
  if(Language1 == 'English' && Language2 != 'English'){
    MailApp.sendEmail(Address1, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
  
  if(Language2 == 'English' && Language1 != 'English'){
    MailApp.sendEmail(Address2, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
}


// **********************************************
// function fcnSendConfirmEmailFR()
//
// This function generates the confirmation email in French
// after a match report has been submitted
//
// **********************************************

function fcnSendConfirmEmailFR(shtConfig, Address, MatchData) {
  
  // Variables
  var EmailSubject;
  var EmailMessage;
  
  // Addresses and Languages for both players
  var Address1  = Address[1][1];
  var Language1 = Address[1][0];
  var Address2  = Address[2][1];
  var Language2 = Address[2][0];
  var AddressBCC;
  
  // Get Document URLs
  var UrlValues = shtConfig.getRange(20,2,3,1).getValues();
  var urlStandings = UrlValues[0][0];
  var urlCardList = UrlValues[1][0];
  var urlMatchReporter = UrlValues[2][0];
  
  // Facebook Page Link
  var urlFacebook = shtConfig.getRange(50, 2).getValue();
  
  // Open Email Templates
  var ssEmailID = shtConfig.getRange(47,2).getValue();
  var ssEmail = SpreadsheetApp.openById(ssEmailID);
  var shtEmailTemplates = ssEmail.getSheetByName('Templates');
  var Headers = shtEmailTemplates.getRange(3,3,29,1).getValues();
  
  // League Name
  var Location = shtConfig.getRange(11,2).getValue();
  var LeagueTypeFR = shtConfig.getRange(14,2).getValue();
  var LeagueNameFR = LeagueTypeFR + ' du ' + Location;

  // Match Data Assignation
  var MatchID = MatchData[2][0];
  var Week    = MatchData[3][0];
  var Winr    = MatchData[4][0];
  var Losr    = MatchData[5][0];
  var PunishPack = 0;
  
  // Add Masterpiece mention if necessary
  if (MatchData[24][2] == 'Last Card is Masterpiece'){
    var Masterpiece = MatchData[23][2];
    MatchData[23][2] += ' (Masterpiece)' 
  }

  // Set Email Subject
  EmailSubject = LeagueNameFR + " - Semaine " + Week + " - Rapport de Match" ;
    
  // Start of Email Message
  EmailMessage = "<html><body>";
  
  EmailMessage += "Bonjour " + Winr + " et " + Losr + ",<br><br>Nous confirmons que nous avons bien reçu et traité le rapport de votre match de la " + LeagueNameFR + ", Semaine " + Week + 
    "<br><br>Voici le sommaire de votre match:<br><br>";
    
  // Generate Match Data Table
  if (MatchData[9][0] != '') PunishPack = 1;
  EmailMessage = subMatchReportTable(EmailMessage, Headers, MatchData, PunishPack);
  
  // Add League Links
  EmailMessage += "<br>Cliquez ci-dessous pour accéder au classement et statistiques de la ligue:"+
    "<br>"+ urlStandings;
  EmailMessage +=   "<br><br>Cliquez ci-dessous pour accéder à votre pool de cartes:"+
    "<br>"+ urlCardList;
  EmailMessage += "<br><br>Cliquez ci-dessous pour envoyer un autre rapport de match:"+
    "<br>"+ urlMatchReporter;
  
  // Add Facebook Page Link if present
  if(urlFacebook != ''){
    EmailMessage += "<br><br>Joignez vous à la page Facebook de la communauté pour discuter avec les autres joueurs et organiser vos parties.<br>" + urlFacebook;
  }
  
  // Add Signature
  EmailMessage += "<br><br>Si vous remarquez quel problème que ce soit dans ce rapport, SVP répondez à ce courriel en décrivant la situation de votre mieux. Vous recevrez une réponse dès que la situation sera traitée."+
    "<br><br>Merci d'utiliser TCG Booster League Manager de Turn 1 Gaming Leagues & Tournaments";
  
  // End of Email Message
  EmailMessage += "</body></html>";

  // If both players share the same language
  if(Language1 == 'Français' && Language2 == 'Français'){
    AddressBCC = Address1 + ', ' + Address2;
    MailApp.sendEmail("", EmailSubject, "",{bcc:AddressBCC, name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
  
  if(Language1 == 'Français' && Language2 != 'Français'){
    MailApp.sendEmail(Address1, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
  
  if(Language2 == 'Français' && Language1 != 'Français'){
    MailApp.sendEmail(Address2, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
}


// PROCESS ERROR MESSAGE ----------------------------------------------------------------------------------------------------------

// **********************************************
// function fcnSendErrorEmailEN()
//
// This function generates the error email in English
// after a match report has been submitted
//
// **********************************************

function fcnSendErrorEmailEN(shtConfig, Address, MatchData, MatchID, Status) {
  
  // Variables
  var EmailSubject;
  var EmailMessage;  
  var Address1;
  var Language1;
  var Address2;
  var Language2;
  var AddressBCC;
  
  // Get Document URLs
  var UrlValues = shtConfig.getRange(17,2,3,1).getValues();
  var urlStandings = UrlValues[0][0];
  var urlCardList = UrlValues[1][0];
  var urlMatchReporter = UrlValues[2][0];
  
  // Open Email Templates
  var ssEmailID = shtConfig.getRange(47,2).getValue();
  var ssEmail = SpreadsheetApp.openById(ssEmailID);
  var shtEmailTemplates = ssEmail.getSheetByName('Templates');
  var Headers = shtEmailTemplates.getRange(3,2,29,1).getValues();
  
  // League Name
  var Location = shtConfig.getRange(11,2).getValue();
  var LeagueTypeEN = shtConfig.getRange(13,2).getValue();
  var LeagueNameEN = Location + ' ' + LeagueTypeEN;
  
  // Match Data Assignation
  var MatchID = MatchData[2][0];
  var Week    = MatchData[3][0];
  var Winr    = MatchData[4][0];
  var Losr    = MatchData[5][0];
  
  var StatusMsg;
   
  // Selects the Appropriate Error Message
  switch (Status[0]){
  
    case -10 : StatusMsg = 'Match Result has already been received and processed.'; break; // Administrator + Players
    case -11 : StatusMsg = '<b>'+Winr+'</b> is eliminated from League.'; break;    // Administrator + Players
    case -12 : StatusMsg = '<b>'+Winr+'</b> has played too many matches this week. Matches played: '+MatchData[4][1]; break;  // Administrator + Players 
    case -21 : StatusMsg = '<b>'+Losr+'</b> is eliminated from League.'; break;    // Administrator + Players
    case -22 : StatusMsg = '<b>'+Losr+'</b> has played too many matches this week. Matches played: '+MatchData[5][1]; break;  // Administrator + Players 
    case -31 : StatusMsg = 'Both players are eliminated from League.'; break; // Administrator + Players 
    case -32 : StatusMsg = '<b>'+Winr+'</b> is eliminated from League.<br><b>'+Losr+'</b> has played too many matches this week. Matches played: '+MatchData[5][1]; break;  // Administrator + Players
    case -33 : StatusMsg = '<b>'+Winr+'</b> has player too many matches this week. Matches played: <b>'+MatchData[4][1]+'</b>.<br><b>'+Losr+'</b> is eliminated from League.'; break;  // Administrator + Players
    case -34 : StatusMsg = 'Both Players have played too many matches this week.<br><b>'+Winr+'</b> Matches played: <b>'+MatchData[4][1]+'</b><br><b>'+Losr+'</b> Matches played: <b>'+MatchData[5][1]+'</b>'; break; // Administrator + Players
    case -50 : StatusMsg = 'Same player selected for Win and Loss.<br>Winner: <b>'+Winr+'</b><br>Loser: <b>' +Losr+ '</b>'; break; // Administrator + Players
    case -60 : StatusMsg = Status[1]; break;  // Administrator + Players
	case -97 : StatusMsg = 'Process Error, Match Results Post Not Executed'; break;        // Administrator
    case -98 : StatusMsg = 'Process Error, Matching Response Search Not Executed'; break;  // Administrator
    case -99 : StatusMsg = 'Process Error, Duplicate Entry Search Not Executed'; break;    // Administrator
  }
  
  // Set Email Subject
  EmailSubject = LeagueNameEN + ' - Week ' + Week + ' - Match Report Error' ;
  
  // Start of Email Message
  EmailMessage = '<html><body>';

  // If Error prevented Match Data to be processed (Duplicate Entry or Player Match is not valid)  
  if (Status[0] < 0 && Status[0] > -60) {
    EmailMessage += 'Hi ' + Winr + ' and ' + Losr + ',<br><br>Your match result has been succesfully received for the ' + LeagueNameEN + ', Week ' + Week + 
      "<br><br>An error has been detected in one of the player's record. Unfortunately, this error prevented us to process the match report.<br><br>"+
        "<b>Error Detected</b><br>" + StatusMsg +
          '<br><br>Here is your match result:<br><br>';
    
    // Populate the Match Data Table
    EmailMessage = subMatchReportTable(EmailMessage, Headers, MatchData,StatusMsg);
  }

  // If Error did not prevent Match Data to be processed (Card Name not Found for Card Number X)    
  if (Status[0] == -60){
    EmailMessage += 'Hi ' + Winr + ' and ' + Losr + ',<br><br>Your match result has been succesfully received for the ' + LeagueNameEN + ', Week ' + Week + 
      "<br><br>We were able to process the match data but an error has been detected in the submitted form.<br>Please contact us to resolve this error as soon as possible<br><br>"+
        "<b>Error Detected</b><br>" + StatusMsg +
          '<br><br>Here is your match result:<br><br>';
    
    // Populate the Match Data Table
    EmailMessage = subMatchReportTable(EmailMessage, Headers, MatchData,StatusMsg);
  }

  // If Process Error was Detected 
  if (Status[0] < -60) {
    EmailMessage += 'Process Error was detected<br><br>'+
        "<b>Error Detected</b><br>" + StatusMsg;
  }
  
  if (Status[0] >= -60) {
    EmailMessage += "<br>Click below to access the League Standings and Results:"+
      "<br>"+ urlStandings +
        "<br><br>Click below to access your Card Pool:"+
          "<br>"+ urlCardList +
            "<br><br>Click below to send another Match Report:"+
              "<br>"+ urlMatchReporter +
                "<br><br>If you find any problems with your match result, please reply to this message and describe the situation as best you can. You will receive a response once it has been processed."+
                  "<br><br>Thank you for using TCG Booster League Manager from Turn 1 Gaming Leagues & Tournaments";
  }
  
  // End of Email Message
  EmailMessage += '</body></html>';
   
  // Send email to Administrator
  MailApp.sendEmail(Address[0][1], EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  
  // If Error is between 0 and -60, send email to players. If not, only send to Administrator
  if (Status[0] >= -60){
    // Sends email to both players with the Match Data
    if (Address[1][0] == 'English' && Address[1][1] != '') {
      MailApp.sendEmail(Address[1][1], EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
    }
    if (Address[2][0] == 'English' && Address[2][1] != ''&& Address[1][1] != Address[2][1]) {
      MailApp.sendEmail(Address[2][1], EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
    }
  }
}

// **********************************************
// function fcnSendErrorEmailFR()
//
// This function generates the error email in French
// after a match report has been submitted
//
// **********************************************

function fcnSendErrorEmailFR(shtConfig, Address, MatchData, MatchID, Status) {
  
  // Variables
  var EmailSubject;
  var EmailMessage;  
  var Address1;
  var Language1;
  var Address2;
  var Language2;
  var AddressBCC;
  
  // Get Document URLs
  var UrlValues = shtConfig.getRange(20,2,3,1).getValues();
  var urlStandings = UrlValues[0][0];
  var urlCardList = UrlValues[1][0];
  var urlMatchReporter = UrlValues[2][0];
  
  // Open Email Templates
  var ssEmailID = shtConfig.getRange(47,2).getValue();
  var ssEmail = SpreadsheetApp.openById(ssEmailID);
  var shtEmailTemplates = ssEmail.getSheetByName('Templates');
  var Headers = shtEmailTemplates.getRange(3,3,29,1).getValues();
    
  // League Name
  var Location = shtConfig.getRange(11,2).getValue();
  var LeagueTypeFR = shtConfig.getRange(14,2).getValue();
  var LeagueNameFR = LeagueTypeFR + ' du ' + Location;

  // Match Data Assignation
  var MatchID = MatchData[2][0];
  var Week    = MatchData[3][0];
  var Winr    = MatchData[4][0];
  var Losr    = MatchData[5][0];
  
  var StatusMsg;
   
  // Selects the Appropriate Error Message
  switch (Status[0]){
  
    case -10 : StatusMsg = 'Le résultat de ce match a déjà été reçu et traité.'; break; // Administrator + Players
    case -11 : StatusMsg = '<b>'+Winr+'</b> est éliminé(e) de la ligue.'; break;    // Administrator + Players
    case -12 : StatusMsg = '<b>'+Winr+'</b> a joué le maximum de match permis. Matches joués: '+MatchData[4][1]; break;  // Administrator + Players 
    case -21 : StatusMsg = '<b>'+Losr+'</b> est éliminé(e) de la ligue.'; break;    // Administrator + Players
    case -22 : StatusMsg = '<b>'+Losr+'</b> a joué le maximum de match permis. Matches joués: '+MatchData[5][1]; break;  // Administrator + Players 
    case -31 : StatusMsg = 'Les deux joueurs sont éliminés de la ligue.'; break; // Administrator + Players 
    case -32 : StatusMsg = '<b>'+Winr+'</b> est éliminé(e) de la ligue.<br><b>'+Losr+'</b> a joué le maximum de match permis. Matches joués: '+MatchData[5][1]; break;  // Administrator + Players
    case -33 : StatusMsg = '<b>'+Winr+'</b> a joué le maximum de match permis. Matches joués: <b>'+MatchData[4][1]+'</b>.<br><b>'+Losr+'</b> est éliminé(e) de la ligue.'; break;  // Administrator + Players
    case -34 : StatusMsg = 'Les deux joueurs ont joué le maximum de match permis.<br><b>'+Winr+'</b> Matches joués: <b>'+MatchData[4][1]+'</b><br><b>'+Losr+'</b> Matches joués: <b>'+MatchData[5][1]+'</b>'; break; // Administrator + Players
    case -50 : StatusMsg = 'Le même joueur a été sélectionné comme joueur gagnant et perdant.<br>Joueur gagnant: <b>'+Winr+'</b><br>Joueur perdant: <b>' +Losr+ '</b>'; break; // Administrator + Players
    case -60 : StatusMsg = Status[1]; break;  // Administrator + Players
	case -97 : StatusMsg = 'Process Error, Match Results Post Not Executed'; break;        // Administrator
    case -98 : StatusMsg = 'Process Error, Matching Response Search Not Executed'; break;  // Administrator
    case -99 : StatusMsg = 'Process Error, Duplicate Entry Search Not Executed'; break;    // Administrator
  }
  
  // Set Email Subject
  EmailSubject = LeagueNameFR + ' - Semaine ' + Week + ' - Erreur Rapport de Match' ;
  
  // Start of Email Message
  EmailMessage = "<html><body>";

  // If Error prevented Match Data to be processed (Duplicate Entry or Player Match is not valid)  
  if (Status[0] < 0 && Status[0] > -60) {
    EmailMessage += "Bonjour " + Winr + " et " + Losr + ",<br><br>Nous confirmons que nous avons bien reçu le résultat de votre match de la " + LeagueNameFR + ", Semaine " + Week + 
      "<br><br>Nous avons détecté une erreur dans la fiche d'un joueur qui nous a empêché de traiter le rapport du match.<br><br>"+
        "<b>Erreur détectée</b><br>" + StatusMsg +
          "<br><br>Voici le sommaire de votre match:<br><br>";
    
    // Populate the Match Data Table
    EmailMessage = subMatchReportTable(EmailMessage, Headers, MatchData,StatusMsg);
  }

  // If Error did not prevent Match Data to be processed (Card Name not Found for Card Number X)    
  if (Status[0] == -60){
    EmailMessage += "Bonjour " + Winr + " et " + Losr + ",<br><br>Nous confirmons que nous avons bien reçu le résultat de votre match de la " + LeagueNameFR + ", Semaine " + Week + 
      "<br><br>Nous avons été en mesure de traiter le rapport de votre match mais avons détecté une erreur dans les informations reçues.<br>SVP, contactez-nous le plus rapidement possible pour corriger cette erreur<br><br>"+
        "<b>Erreur détectée</b><br>" + StatusMsg +
          "<br><br>Voici le sommaire de votre match:<br><br>";
    
    // Populate the Match Data Table
    EmailMessage = subMatchReportTable(EmailMessage, Headers, MatchData,StatusMsg);
  }

  // If Process Error was Detected 
  if (Status[0] < -60) {
    EmailMessage += "Process Error was detected<br><br>"+
      "<b>Erreur détectée</b><br>" + StatusMsg;
  }
  
  if (Status[0] >= -60) {
    EmailMessage += "<br>Cliquez ci-dessous pour accéder au classement et statistiques de la ligue:"+
      "<br>"+ urlStandings +
        "<br><br>Cliquez ci-dessous pour accéder à votre pool de cartes:"+
          "<br>"+ urlCardList +
            "<br><br>Cliquez ci-dessous pour envoyer un autre rapport de match:"+
              "<br>"+ urlMatchReporter +
                "<br><br>Si vous remarquez quel problème que ce soit dans ce rapport, SVP répondez à ce courriel en décrivant la situation de votre mieux. Vous recevrez une réponse dès que la situation sera traitée."+
                  "<br><br>Merci d'utiliser TCG Booster League Manager de Turn 1 Gaming Leagues & Tournaments";
  }
  
  // End of Email Message
  EmailMessage += "</body></html>";
   
  // Send email to Administrator
  // MailApp.sendEmail(Address[0][1], EmailSubject, EmailMessage,{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  
  // If Error is between 0 and -60, send email to players. If not, only send to Administrator
  if (Status[0] >= -60){
    // Sends email to both players with the Match Data
    if (Address[1][0] == 'Français' && Address[1][1] != '') {
      MailApp.sendEmail(Address[1][1], EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
    }
    if (Address[2][0] == 'Français' && Address[2][1] != ''&& Address[1][1] != Address[2][1]) {
      MailApp.sendEmail(Address[2][1], EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
    }
  }
}

// MATCH REPORT TABLE ----------------------------------------------------------------------------------------------------------

// **********************************************
// function subMatchReportTable()
//
// This function generates the HTML table that displays 
// the Match Data and Booster Pack Data
//
// **********************************************

function subMatchReportTable(EmailMessage, Headers, MatchData, Param){
  
  var Item = Headers[25][0];
  var CardNumber = Headers[26][0];
  var CardName = Headers[27][0];
  var CardRarity = Headers[28][0];
    
  for(var row=0; row<24; ++row){

    // Translate MatchData if necessary
    if (Param == 'EN' && MatchData[row][0] == 'Oui') MatchData[row][0] = 'Yes';
    if (Param == 'EN' && MatchData[row][0] == 'Non') MatchData[row][0] = 'No' ;
    if (Param == 'FR' && MatchData[row][0] == 'Yes') MatchData[row][0] = 'Oui';
    if (Param == 'FR' && MatchData[row][0] == 'No' ) MatchData[row][0] = 'Non';
    
    // Start of Match Table
    if(row == 0) {
      EmailMessage += '<table style="border-collapse:collapse;" border = 1 cellpadding = 5><tr>';
    }
    
    // Match Data
    if(row < 7) {
      EmailMessage += '<tr><td>'+Headers[row][0]+'</td><td>'+MatchData[row][0]+'</td></tr>';
    }
    
    // End of first Table
    if(row == 7) EmailMessage += '</table><br>';
    
    // Start of Pack Table
    if(row == 9 && Param == 1) {
      EmailMessage += 'Booster Pack Content<br><br><font size="4"><b>'+MatchData[row][0]+
        '</b></font><br><table style="border-collapse:collapse;" border = 1 cellpadding = 5><th>'+Item+'</th><th>'+CardNumber+'</th><th>'+CardName+'</th><th>'+CardRarity+'</th>';
    }
    
    // Pack Data
    if(row > 9 && Param == 1) {
      EmailMessage += '<tr><td>'+Headers[row][0]+'</td><td><center>'+MatchData[row][1]+'</td><td>'+MatchData[row][2]+'</td><td><center>'+MatchData[row][3]+'</td></tr>';
    }

    // If Param is Null, No Pack was opened 
    if(row == 9 && Param == '') {
      EmailMessage += '<br><font size="4"><b>No Booster Pack Opened</b></font><br><br>'
      row = 24;
    }
    
    // If Param is Not 1, Error is Present 
    if(row == 9 && Param != 1) {
      row = 24;
    }
    
  }
  return EmailMessage +'</table>';
}


// NEW PLAYER CONFIRMATION  ----------------------------------------------------------------------------------------------------------

// **********************************************
// function fcnSendNewPlayerConf()
//
// This function sends a confirmation to the
// New Player with Appropriate Links
//
// **********************************************

function fcnSendNewPlayerConf(shtConfig, PlayerData){

  // Variables
  var EmailSubject;
  var EmailMessage;
  
  var PlayerName  = PlayerData[3]; 
  var PlayerEmail = PlayerData[4]; 
  var PlayerLang  = PlayerData[6]; 
  
  // League Name
  var Location = shtConfig.getRange(11,2).getValue();
  
  // Facebook Page Link
  var urlFacebook = shtConfig.getRange(50, 2).getValue();
  
  // English
  if(PlayerLang == 'English' ){
    
    var LeagueTypeEN = shtConfig.getRange(13,2).getValue();
    var LeagueNameEN = Location + ' ' + LeagueTypeEN;
    
    // Get Document URLs
    var UrlValues = shtConfig.getRange(17,2,3,1).getValues();
    var urlStandings = UrlValues[0][0];
    var urlCardList = UrlValues[1][0];
    var urlMatchReporter = UrlValues[2][0];
    
    // Set Email Subject
    EmailSubject = 'Subscription Confirmation - ' + LeagueNameEN;
    
    // Start of Email Message
    EmailMessage = '<html><body>';
    
    EmailMessage += 'Hi ' +PlayerName+ ','+
      '<br><br>This message is to confirm your registration to the : '+LeagueNameEN;
    
    // If All links are non-null
    if (urlMatchReporter != '' && urlStandings != '' && urlCardList != ''){ 
      EmailMessage += '<br><br>From now on, you can submit your match results by clicking on the following link:<br><br>'+urlMatchReporter;
      EmailMessage += '<br><br>You can look at the league results and standings at the following link:<br><br>'+urlStandings
      EmailMessage += '<br><br>Finally, You can check your card pool as well as all other players in the league at the following link '+
        '(I will send you a confirmation when all card pools will be completed):'+
          '<br><br>'+urlCardList;
    }
       
    // If one of them is null    
    if (urlMatchReporter == '' || urlStandings == '' || urlCardList == ''){
      EmailMessage += "<br><br>The League links are under construction, You will receive them as soon as they are operational.";
    }
    
    // Add Facebook Page Link if present
    if(urlFacebook != ''){
      EmailMessage += "<br><br>Please join the Community Facebook page to chat with other players and plan matches.<br>" + urlFacebook;
    }
    
    EmailMessage += '<br><br>If you have any question or comment, please do not hesitate to contact me, it will be my pleasure to answer you as soon as I can.'+
      '<br><br>Thank you and Good Luck'+
        '<br><br>---------------<br><br>Eric Bouchard<br>Turn 1 Gaming Leagues & Tournament Applications';
    
    // End of Email Message
    EmailMessage += '</body></html>';
  }
  
  // French
  if(PlayerLang == 'Français'){

    var LeagueTypeFR = shtConfig.getRange(14,2).getValue();
    var LeagueNameFR = LeagueTypeFR + ' du ' + Location;
    
    // Get Document URLs
    var UrlValues = shtConfig.getRange(20,2,3,1).getValues();
    var urlStandings = UrlValues[0][0];
    var urlCardList = UrlValues[1][0];
    var urlMatchReporter = UrlValues[2][0];
    
    // Set Email Subject
    EmailSubject = 'Confirmation Inscription - ' + LeagueNameFR;
    
    // Start of Email Message
    EmailMessage = '<html><body>';
    
    EmailMessage += 'Bonjour ' +PlayerName+ ','+
      '<br><br>Ceci est pour confirmer ton inscription à la ligue: '+LeagueNameFR;
    
    // If All links are non-null
    if (urlMatchReporter != '' && urlStandings != '' && urlCardList != ''){    
      EmailMessage += '<br><br>À partir de maintenant, tu peux soumettre tes rapports de matches en cliquant sur le lien suivant:<br><br>'+urlMatchReporter;
      EmailMessage += '<br><br>Tu peux consulter le classement et statistiques de la ligue au lien suivant:<br><br>'+urlStandings;
      EmailMessage += '<br><br>Finalement, tu peux consulter ton pool de cartes ainsi que celui de tous les autres joueurs de la ligue au lien suivant '+
        '(je vous enverrai une confirmation lorsque les pool de cartes seront complétés):'+
          '<br><br>'+urlCardList;
    }
   
    // If one of them is null    
    if (urlMatchReporter == '' || urlStandings == '' || urlCardList == ''){
      EmailMessage += "<br><br>Les liens de la ligue sont en construction, ils te seront envoyés dès qu'ils seront fonctionnels.";
    }
    
    // Add Facebook Page Link if present
    if(urlFacebook != ''){
      EmailMessage += "<br><br>Joignez vous à la page Facebook de la communauté pour discuter avec les autres joueurs et organiser vos parties.<br>" + urlFacebook;
    }
                      
    EmailMessage += '<br><br>Si tu as des questions ou commentaires, svp n’hésite pas à me contacter, il me fera plaisir de te répondre dans les plus brefs délais.'+
      '<br><br>Merci et bonne chance'+
        '<br><br>---------------<br><br>Eric Bouchard<br>Turn 1 Gaming Leagues & Tournament Applications';
    
    // End of Email Message
    EmailMessage += '</body></html>';
  }
  
  // Send Email Confirmation
  MailApp.sendEmail(PlayerEmail, EmailSubject,'',{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
}


// WEEKLY REPORT ----------------------------------------------------------------------------------------------------------

// **********************************************
// function fcnGenWeekReportMsgEN()
//
// This function generates the HTML message for the 
// Weekly Report in English
//
// **********************************************

function fcnGenWeekReportMsgEN(EmailMessage, LastWeek, Week, MatchesPlayed, MatchesPlayedStore, PlayerMostGames, PlayerMostLoss){

  EmailMessage = 'Hello everyone,<br><br>Week ' + LastWeek + ' is now complete and Week '+ Week +' has started.'+
    ' <br><br>Here is the week report'+
      '<br><br><b><font size="4">Week ' + LastWeek + '</b></font>' + 
        '<br><br><b>Total Matches Played: ' + MatchesPlayed + '</b>' +
          '<br><b>Total Matches Played in Store: ' + MatchesPlayedStore + '</b>';

  // Player Awards
  EmailMessage += '<br><br><font size="3"><b>Week Awards</b></font>' +
    "<br>Each week, the player(s) who played the most matches at the store and the player who lost the most matches win a <b>FREE Standard Showdown Booster</b>."+
      "<br>Players mentioned below only have to show this email to the store to claim their Booster."+
        " <br><b>Please note that this booster CANNOT be added to your League Card Pool</b>";

  
  // Most Matches Played in Store
  EmailMessage += '<br><br><font size="2"><b>Most Matches Played in Store</b></font>'+
    '<br>The player with the most matches played in store this week with <b>' + PlayerMostGames[0][1] + ' games played</b>:' + 
    '<br><b>' + PlayerMostGames[0][0] + '</b>';
  
  // Add other players with same record
  if(PlayerMostGames[1][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[1][0] + "</b>";
  if(PlayerMostGames[2][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[2][0] + "</b>";
  if(PlayerMostGames[3][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[3][0] + "</b>";
  if(PlayerMostGames[4][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[4][0] + "</b>";
  
  // Most Losses
  EmailMessage += '<br><br><font size="2"><b>Most Losses</b></font>'+
    '<br>The player with the most losses this week:</b> ' + 
      '<br><b>' + PlayerMostLoss[0][0] + '</b>';
  
  // Add other players with same record
  if(PlayerMostLoss[1][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[1][0] + "</b>";
  if(PlayerMostLoss[2][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[2][0] + "</b>";
  if(PlayerMostLoss[3][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[3][0] + "</b>";
  if(PlayerMostLoss[4][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[4][0] + "</b>";
  
  // Message Ending
  EmailMessage += '<br><br><font size="3">Good luck to all player for week '+ Week + '</font>';
  
  return EmailMessage;
}

// **********************************************
// function fcnGenWeekReportMsgEN()
//
// This function generates the HTML message for the 
// Weekly Report in French
//
// **********************************************

function fcnGenWeekReportMsgFR(EmailMessage, LastWeek, Week, MatchesPlayed, MatchesPlayedStore, PlayerMostGames, PlayerMostLoss){
  
  EmailMessage = 'Bonjour tout le monde,<br><br>La semaine ' + LastWeek + ' est maintenant terminée et la semaine '+ Week +' vient de commencer.'+
    ' <br><br>Voici le rapport de la semaine ' + 
      '<br><br><b><font size="4">Semaine'+ LastWeek +'</b></font>' +
        '<br><br><b>Nombre total de parties joués: ' + MatchesPlayed + '</b>' +
          '<br><b>Nombre total de parties joués au magasin: ' + MatchesPlayedStore + '</b>';

  // Player Awards
  EmailMessage += '<br><br><font size="3"><b>Prix de la semaine </b></font>' +
    "<br>Chaque semaine, le joueur qui a joué le plus de parties au magasin et le joueur qui a perdu le plus de parties remportent un <b>Booster Standard Showdown GRATUIT</b>."+
      "<br>Les personnes mentionnées ci-dessous n'ont qu'à se présenter au magasin avec ce courriel pour réclamer leur Booster."+
        " <br><b>SVP, prenez en note que ce Booster NE PEUT PAS être ajouté à votre Pool de Carte de Ligue</b>";

  
  // Most Matches Played in Store
  EmailMessage += '<br><br><font size="2"><b>Plus de Parties en Magasin</b></font>'+
    '<br>Le joueur ayant joué le plus de parties en magasin avec <b>' + PlayerMostGames[0][1] + ' parties joués</b>:' + 
    '<br><b>' + PlayerMostGames[0][0] + '</b>';
  
  // Add other players with same record
  if(PlayerMostGames[1][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[1][0] + "</b>";
  if(PlayerMostGames[2][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[2][0] + "</b>";
  if(PlayerMostGames[3][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[3][0] + "</b>";
  if(PlayerMostGames[4][0] != '') EmailMessage += "<br><b>" + PlayerMostGames[4][0] + "</b>";
  
  // Most Losses
  EmailMessage += '<br><br><font size="2"><b>Plus de parties perdues</b></font>'+
    '<br>Le joueur qui a perdu le plus de parties cette semaine: ' + 
      '<br><b>' + PlayerMostLoss[0][0] + '</b>';
  
  // Add other players with same record
  if(PlayerMostLoss[1][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[1][0] + "</b>";
  if(PlayerMostLoss[2][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[2][0] + "</b>";
  if(PlayerMostLoss[3][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[3][0] + "</b>";
  if(PlayerMostLoss[4][0] != '') EmailMessage += "<br><b>" + PlayerMostLoss[4][0] + "</b>";
  
  // Message Ending
  EmailMessage += '<br><br><font size="3">Bonne chance à tous pour la semaine '+ Week + '</font>';

  return EmailMessage;
}


// WEEKLY BOOSTER CONFIRMATION ----------------------------------------------------------------------------------------------------------

// **********************************************
// function fcnSendBstrCnfrmEmail()
//
// This function generates the confirmation email in English
// after a match report has been submitted
//
// **********************************************

function fcnSendBstrCnfrmEmail(Player, Week, EmailAddresses, PackData, shtConfig) {
  
  // Variables
  var EmailSubject;
  var EmailMessage;
  var Address  = EmailAddresses[1];
  var Language = EmailAddresses[0];
  
  // Open Email Templates
  var ssEmailID = shtConfig.getRange(47,2).getValue();  
  
  // League Location Name
  var Location = shtConfig.getRange(11,2).getValue();
  
  // Facebook Page Link
  var urlFacebook = shtConfig.getRange(50, 2).getValue();
  
  // Add Masterpiece mention if necessary
  if (PackData[15][2] == 'Masterpiece'){
    //var Masterpiece = PackData[14][2];
    PackData[14][2] += ' (Masterpiece)' 
  }
  
  // English
  if(Language == 'English'){  
    
    // Table Headers
    var HeadersEN = SpreadsheetApp.openById(ssEmailID).getSheetByName('Templates').getRange(12,2,20,1).getValues();
    
    // Document URLs
    var UrlValuesEN = shtConfig.getRange(17,2,3,1).getValues();
    var urlStandings = UrlValuesEN[0][0];
    var urlCardPool = UrlValuesEN[1][0];
    var urlMatchReporter = UrlValuesEN[2][0];
    
    // League Name
    var LeagueTypeEN = shtConfig.getRange(13,2).getValue();
    var LeagueName = Location + ' ' + LeagueTypeEN;
    
    // Set Email Subject
    EmailSubject = LeagueName + " - Week " + Week + " - Weekly Booster" ;
    
    // Start of Email Message
    EmailMessage = '<html><body>';
    
    EmailMessage += 'Hi ' + Player + ',<br><br>You have succesfully added a Booster to your Card Pool for the ' + LeagueName + ', Week ' + Week + '.' +
      '<br><br>Here is the list of cards added to your pool.';
    
    // Builds the Pack Table
    EmailMessage = subBstrTable(EmailMessage, HeadersEN, PackData, Language, 1);
    
    EmailMessage += "<br><br>Click below to access your Card Pool."+
      "<br>"+ urlCardPool;
      
    // Add Facebook Page Link if present
    if(urlFacebook != ''){
      EmailMessage += "<br><br>Please join the Community Facebook page to chat with other players and plan matches.<br>" + urlFacebook;
    }
    
    // Signature
    EmailMessage += "<br><br>Thank you for using TCG Booster League Manager from Turn 1 Gaming Leagues & Tournaments";
    
    // End of Email Message
    EmailMessage += '</body></html>';
    
    // Send Email to player
    MailApp.sendEmail(Address, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
  
  // French
  if(Language == 'Français'){  
    
    // Table Headers
    var HeadersFR = SpreadsheetApp.openById(ssEmailID).getSheetByName('Templates').getRange(12,3,20,1).getValues();
    
    // Document URLs
    var UrlValuesFR = shtConfig.getRange(20,2,3,1).getValues();
    var urlStandings = UrlValuesFR[0][0];
    var urlCardPool = UrlValuesFR[1][0];
    var urlMatchReporter = UrlValuesFR[2][0];
    
    // League Name
    var LeagueTypeFR = shtConfig.getRange(14,2).getValue();
    var LeagueName = LeagueTypeFR + ' du ' + Location;
    
    // Set Email Subject
    EmailSubject = LeagueName + " - Semaine " + Week + " - Booster de Semaine" ;
    
    // Start of Email Message
    EmailMessage = '<html><body>';
    
    EmailMessage += 'Bonjour ' + Player + ',<br><br>Vous avez ajouté avec succès un booster à votre Pool de Cartes pour la semaine ' + Week + ' de la ' + LeagueName + '.' +
      '<br><br>Voici la liste des cartes ajoutées à votre pool.';
    
    // Builds the Pack Table
    EmailMessage = subBstrTable(EmailMessage, HeadersFR, PackData, Language, 1);
    
    EmailMessage += "<br><br>Cliquez ci-dessous pour accéder à votre Pool de Cartes:"+
      "<br>"+ urlCardPool;
    
    // Add Facebook Page Link if present
    if(urlFacebook != ''){
      EmailMessage += "<br><br>Joignez vous à la page Facebook de la communauté pour discuter avec les autres joueurs et organiser vos parties.<br>" + urlFacebook;
    }

    // Signature
    EmailMessage += "<br><br>Merci d'utiliser TCG Booster League Manager de Turn 1 Gaming Leagues & Tournaments";
    
    // End of Email Message
    EmailMessage += '</body></html>';
    
    // Send Email to player
    MailApp.sendEmail(Address, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
}


// WEEKLY BOOSTER ERROR ----------------------------------------------------------------------------------------------------------

// **********************************************
// function fcnSendBstrErrorEmailFR()
//
// This function generates the confirmation email in English
// after a match report has been submitted
//
// **********************************************

function fcnSendBstrErrorEmail(Player, Week, EmailAddresses, PackData, ErrorMsg, shtConfig) {
  
  // Variables
  var EmailSubject;
  var EmailMessage;
  
  // Email and Language Preference
  var Language = EmailAddresses[0];
  var Address  = EmailAddresses[1];

  // Email Template Header
  var ssEmailID = shtConfig.getRange(47,2).getValue();
  var shtEmailTemplates = SpreadsheetApp.openById(ssEmailID).getSheetByName('Templates')
  
  // League Location Name
  var Location = shtConfig.getRange(11,2).getValue();

  // English
  if(Language == 'English'){
    
    // League Name
    var LeagueTypeEN = shtConfig.getRange(13,2).getValue();
    var LeagueName = Location + ' ' + LeagueTypeEN;
    
    // Email Template Header
    var HeadersEN = shtEmailTemplates.getRange(12,2,20,1).getValues();
    
    // Weekly Booster Forms URL
    var UrlWeekBstrForm = shtConfig.getRange(27,2).getValue();
    
    // Set Email Subject
    EmailSubject = LeagueName + " - Week " + Week + " - Weekly Booster Error" ;
    
    // Start of Email Message
    EmailMessage = "<html><body>";
    
    EmailMessage += "Hi,<br><br><b>The week "+ Week +" Booster for player  " + Player + ".</b> could not be processed.";
    
    EmailMessage += "<br><br><b>Booster Information</b>"+
      "<br><br>Week number : <b>" + Week + "</b>"+
        "<br>Player: <b>" + Player + "</b><br>";
    
    // Builds the Pack Table
    EmailMessage = subBstrTable(EmailMessage, HeadersEN, PackData, Language, 1);
    
    EmailMessage += "<br><br>Error Message: <br><br><b>" + ErrorMsg[0] + "</b>";
    
    EmailMessage += "<br><br><br>ENTER ENGLISH MESSAGE...S'il y a un problème au niveau de l'information entrée, recommencez et assurez-vous d'entrer les bonnes informations." + 
      "<br>Cliquez ici pour ajouter un autre Booster: "+ UrlWeekBstrForm +
        "<br><br>Si vous éprouvez d'autres problèmes, répondez à ce courriel en me décrivant la nature de votre problème";
    
    // Signature
    EmailMessage += "<br><br>Thank you for using TCG Booster League Manager from Turn 1 Gaming Leagues & Tournaments";
    
    // End of Email Message
    EmailMessage += '</body></html>';
    
    // Send Email to player
    MailApp.sendEmail(Address, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
  
  // French
  if(Language == 'Français'){
    
    // League Name
    var LeagueTypeFR = shtConfig.getRange(14,2).getValue();
    var LeagueName = LeagueTypeFR + ' du ' + Location;
    
    // Email Template Header
    var HeadersFR = shtEmailTemplates.getRange(12,3,20,1).getValues();
    
    // Weekly Booster Forms URL
    var UrlWeekBstrForm = shtConfig.getRange(28,2).getValue();
    
    // Set Email Subject
    EmailSubject = LeagueName + " - Semaine " + Week + " - Erreur Booster de Semaine" ;
    
    // Start of Email Message
    EmailMessage = "<html><body>";
    
    EmailMessage += "Bonjour,<br><br>Une erreur est survenue lors du traitement du <b>Booster de Semaine "+ Week +" pour " + Player + ".</b>";
    
    EmailMessage += "<br><br><b>Information du Booster</b>"+
      "<br><br>Semaine numéro : <b>" + Week + "</b>"+
        "<br>Nom du Joueur: <b>" + Player + "</b><br>";
    
    // Builds the Pack Table
    EmailMessage = subBstrTable(EmailMessage, HeadersFR, PackData, Language, 1);
    
    EmailMessage += "<br><br>Message d'erreur: <br><br><b>" + ErrorMsg[1] + "</b>";
    
    EmailMessage += "<br><br><br>S'il y a un problème au niveau de l'information entrée, recommencez et assurez-vous d'entrer les bonnes informations." + 
      "<br>Cliquez ici pour ajouter un autre Booster: "+ UrlWeekBstrForm +
        "<br><br>Si vous éprouvez d'autres problèmes, répondez à ce courriel en me décrivant la nature de votre problème";
    
    // Signature
    EmailMessage += "<br><br><br>Merci d'utiliser TCG Booster League Manager de Turn 1 Gaming Leagues & Tournaments";
    
    // End of Email Message
    EmailMessage += '</body></html>';
    
    // Send Email to player
    MailApp.sendEmail(Address, EmailSubject, "",{name:'Turn 1 Gaming League Manager',htmlBody:EmailMessage});
  }
}


// BOOSTER DATA TABLE  ----------------------------------------------------------------------------------------------------------

// **********************************************
// function subBstrTable()
//
// This function generates the HTML table that displays 
// the Match Data and Booster Pack Data
//
// **********************************************

function subBstrTable(EmailMessage, Headers, PackData, Language, Param){
  
  var Item = Headers[16][0];
  var CardNumber = Headers[17][0];
  var CardName = Headers[18][0];
  var CardRarity = Headers[19][0];
    
  for(var row=0; row<15; ++row){

    // Translate MatchData if necessary
    if (Language == 'English' && PackData[row][0] == 'Oui') PackData[row][0] = 'Yes';
    if (Language == 'English' && PackData[row][0] == 'Non') PackData[row][0] = 'No' ;
    if (Language == 'Français' && PackData[row][0] == 'Yes') PackData[row][0] = 'Oui';
    if (Language == 'Français' && PackData[row][0] == 'No' ) PackData[row][0] = 'Non';
    
    // Start of Pack Table
    if(row == 0 && Param == 1) {
      // English
      if(Language == 'English') EmailMessage += '<br><br><font size="4"><b>'+'Set: '+PackData[row][1]+'<br>';
      
      // French
      if(Language == 'Français') EmailMessage += '<br><br><font size="4"><b>'+'Set: '+PackData[row][1]+'<br>';

      EmailMessage += '</b></font><br><table style="border-collapse:collapse;" border = 1 cellpadding = 5><th>'+Item+'</th><th>'+CardNumber+'</th><th>'+CardName+'</th><th>'+CardRarity+'</th>';
    }
    
    // Pack Data 
    if(row > 0 && Param == 1) {
      EmailMessage += '<tr><td>'+Headers[row][0]+'</td><td><center>'+PackData[row][1]+'</td><td>'+PackData[row][2]+'</td><td><center>'+PackData[row][3]+'</td></tr>';
    }
  }
  return EmailMessage +'</table>';
}

// PENALTY LOSS TABLE  ----------------------------------------------------------------------------------------------------------

// **********************************************
// function subEmailPlayerPenaltyTable()
//
// This function generates the HTML table that displays 
// the Match Data and Booster Pack Data
//
// **********************************************

function subEmailPlayerPenaltyTable(PlayerData){
  
  var EmailMessage;
  
  for(var row=0; row<33; ++row){

    if(PlayerData[row][0] != ''){
      
      // Start of Table
      if(row == 0) {
        EmailMessage = 'Players who have not completed the minimum number of matches have received penalty losses on their record.<br>Here is the list of penalty losses this week.<br><br><font size="4"><b><table style="border-collapse:collapse;" border = 1 cellpadding = 5><tr>';
        EmailMessage += '<tr><td><b>Player Name</b></td><td><b>Penalty Losses</b></td></tr>';
      }
      
      // Player Data
      EmailMessage += '<tr><td>'+PlayerData[row][0]+'</td><td>'+PlayerData[row][1]+'</td></tr>';
    }
    if(PlayerData[row][0] == '') row = 33;
  }
  return EmailMessage +'</table>';
}