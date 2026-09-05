const parsePerformanceAnnotations = (annotations) => annotations
  .filter((annotation) => annotation.type === 'performance' && annotation.description)
  .flatMap((annotation) => {
    try {
      return [JSON.parse(annotation.description)];
    } catch {
      return [];
    }
  });

class StructuredReporter {
  constructor() {
    this.startedAt = Date.now();
    this.tests = [];
  }

  onTestEnd(test, result) {
    this.tests.push({
      title: test.titlePath().slice(1).join(' > '),
      status: result.status,
      durationMs: result.duration,
      error: result.error?.message ?? null,
      metrics: parsePerformanceAnnotations(test.annotations),
    });
  }

  onEnd(result) {
    const passed = this.tests.filter((test) => test.status === 'passed').length;
    const failed = this.tests.filter(
      (test) => !['passed', 'skipped'].includes(test.status),
    ).length;

    const payload = {
      status: result.status === 'passed' && failed === 0 ? 'passed' : 'failed',
      durationMs: Date.now() - this.startedAt,
      passed,
      failed,
      tests: this.tests,
    };

    process.stdout.write(`__ATFORM_RESULT__${JSON.stringify(payload)}\n`);
  }
}

export default StructuredReporter;
