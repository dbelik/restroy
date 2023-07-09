const regex = {
  // eslint-disable-next-line security/detect-unsafe-regex
  cron: /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/,
};

export default regex;
