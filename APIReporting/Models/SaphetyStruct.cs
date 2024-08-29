namespace APIReporting.Models
{
    public class SaphetyStruct
    {
        public bool IsValid { get; set; }
        public object Warnings { get; set; }
        public object Errors { get; set; }
        public object ResultData { get; set; }
        public int ResultCode { get; set; }
    }
}
