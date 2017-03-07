function SurgeFactorUtil() {

}

SurgeFactorUtil.calculateSurgeFactorPerCluster = function (clusters) {
    clusters.forEach(function (cluster) {
        var surgeFactor = 0;
        var count = cluster.count;
        if (count.drivers !== 0) {
            var surgeRatio = count.customers / count.drivers;
            if (surgeRatio <= 1) {
                surgeFactor = 1;
            }
            else if (surgeRatio > 1 && surgeRatio <= 1.5) {
                surgeFactor = 1.2;
            }
            else if (surgeRatio > 1.5 && surgeRatio <= 2.5) {
                surgeFactor = 1.5;
            }
            else if (surgeRatio > 2.5) {
                surgeFactor = 2;
            }
        }
        cluster.surgeFactor = surgeFactor;
    }, this);
}

module.exports = SurgeFactorUtil;