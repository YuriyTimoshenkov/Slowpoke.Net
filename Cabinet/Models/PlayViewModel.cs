using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Cabinet.Models
{
    public class PlayViewModel
    {
        [Required]
        [DataType(DataType.Text)]
        public string CharacterId { get; set; }
    }
}