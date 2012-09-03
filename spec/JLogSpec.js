describe("JLog", function() {
  var logger = null;

  beforeEach(function() {
    logger = new JLog('LoggerName');
  });

  it('should be able to get and set the name of the logger', function() {
    expect(logger.getName()).toEqual('LoggerName');

    logger.setName('NewName');
    expect(logger.getName()).toEqual('NewName');
  });

  it('should be able to turn the logger on and off and test its state', function() {
    expect(logger.isOn()).toBe(true);

    logger.turnOff();
    expect(logger.isOn()).toBe(false);

    logger.turnOn();
    expect(logger.isOn()).toBe(true);
  });

  it('the default level should be ALL', function() {
    expect(logger.getLevel()).toBe(JLog.ALL);
  });

  it('should be able to set and get the level of the logger', function() {
    logger.setLevel();
    expect(logger.getLevel()).toBe(JLog.NONE);
    logger.setLevel('nonsense');
    expect(logger.getLevel()).toBe(JLog.NONE);
    logger.setLevel('all');
    expect(logger.getLevel()).toBe(JLog.ALL);
    logger.setLevel('debug');
    expect(logger.getLevel()).toBe(JLog.DEBUG);
    logger.setLevel('info');
    expect(logger.getLevel()).toBe(JLog.INFO);
    logger.setLevel('error');
    expect(logger.getLevel()).toBe(JLog.ERROR);
    logger.setLevel('fatal');
    expect(logger.getLevel()).toBe(JLog.FATAL);
    logger.setLevel('warn');
    expect(logger.getLevel()).toBe(JLog.WARN);
  });
});