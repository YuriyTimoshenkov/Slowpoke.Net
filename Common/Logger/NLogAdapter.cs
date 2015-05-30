using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;

namespace Common
{
    public class NLogAdapter : ILogger
    {
        private Logger _logger;

        public NLogAdapter(string name)
        {
            _logger = LogManager.GetLogger(name);
        }

        public void Debug(string message)
        {
            _logger.Debug(message);
        }

        public void Info(string message)
        {
            _logger.Info(message);
        }

        public void Error(string message, Exception exp)
        {
            _logger.Error(message, exp);
        }

        public void Error(Exception exp)
        {
            _logger.Error(exp);
        }
    }
}
