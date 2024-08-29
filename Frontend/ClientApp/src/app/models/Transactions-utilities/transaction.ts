export interface TransactionsUI{
  company_document : string,
  date : Date,
  user : string,
  transaction_type : number, //Update=1, SentQA=2, SentPRD=3, Delete=4
  description : string
}
