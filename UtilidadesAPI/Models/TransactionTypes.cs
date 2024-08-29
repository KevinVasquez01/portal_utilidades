using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UtilidadesAPI.Models
{
    public enum TransactionTypes
    {
        /// <summary>
        /// Actualización
        /// </summary>
        Update=1,

        /// <summary>
        /// Envio a Saphety QA
        /// </summary>
        SentQA=2,

        /// <summary>
        /// Envio a Saphety PRD
        /// </summary>
        SentPRD=3,

        /// <summary>
        /// Eliminacion
        /// </summary>
        Delete=4
    }
}
