const parseMetrics = (test) => test.annotations
  .filter((annotation) => annotation.type === 'performance' && annotation.description)
  .flatMap((annotation) => {
    try {
      return [JSON.parse(annotation.description)];
    } catch {
      return [];
    }
  });

class PerformanceReporter {
  constructor() {
    this.rows = [];
  }

  onTestEnd(test, result) {
    this.rows.push({
      example: test.titlePath()[1] || test.title,
      status: result.status,
      metrics: parseMetrics(test),
      error: result.error?.message,
    });
  }

  onEnd(result) {
    console.log('\nPerformance Regression Tests\n');

    for (const row of this.rows) {
      console.log(row.example);

      for (const metric of row.metrics) {
        console.log(
          `  ${metric.name}: median ${metric.median.toFixed(1)} ms`
          + ` · limit ${metric.limit.toFixed(1)} ms`
          + ` · ${metric.pass ? 'PASS' : 'FAIL'}`,
        );
      }

      if (row.error) {
        console.log(`  ${row.error.split('\n')[0]}`);
      }

      console.log(`  Status: ${row.status === 'passed' ? 'PASS' : 'FAIL'}\n`);
    }

    console.log(`Overall: ${result.status === 'passed' ? 'PASS' : 'FAIL'}`);
  }
}

export default PerformanceReporter;
