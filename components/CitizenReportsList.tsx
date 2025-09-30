import { CitizenReport } from '@/types'

interface CitizenReportsListProps {
  reports: CitizenReport[];
}

export function CitizenReportsList({ reports }: CitizenReportsListProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">
          No citizen reports yet. Be the first to share your shutdown survival tactics!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reports.map((report) => {
        const name = report.metadata?.name;
        const location = report.metadata?.location;
        const survivalTactics = report.metadata?.survival_tactics;

        if (!name || !location || !survivalTactics) {
          return null;
        }

        return (
          <div 
            key={report.id} 
            className="border-l-4 border-govt-blue pl-6 py-4 bg-gray-50 rounded-r-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h4 className="font-semibold text-govt-gray text-lg">
                {name}
              </h4>
              <span className="text-sm text-gray-600 mt-1 sm:mt-0">
                📍 {location}
              </span>
            </div>
            <p className="text-govt-gray leading-relaxed">
              {survivalTactics}
            </p>
          </div>
        );
      })}
    </div>
  );
}