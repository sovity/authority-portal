import {Component, HostBinding, Input} from '@angular/core';
import {
  ComponentStatusDto,
  UptimeStatusDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {humanizeDuration} from 'src/app/core/utils/time-utils';
import {DonutChartData} from '../donut-chart/donut-chart-data';

@Component({
  selector: 'app-dashboard-component-uptime-card',
  templateUrl: './dashboard-component-uptime-card.component.html',
})
export class DashboardComponentUptimeCardComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.items-stretch')
  @HostBinding('class.h-[20rem]')
  @HostBinding('class.border')
  @HostBinding('class.border-gray-100')
  @HostBinding('class.shadow')
  @HostBinding('class.rounded-xl')
  @HostBinding('class.p-6')
  @HostBinding('class.overflow-hidden')
  cls = true;

  @Input() label!: string;
  private _data!: Fetched<UptimeStatusDto | undefined>;
  @Input() set data(value: Fetched<UptimeStatusDto | undefined>) {
    this._data = value;
    this.chartData = value
      .mapNotNull((it) => this.buildDonutChartData(it))
      .orElse(null);
    this.upSinceTooltip = value
      .mapNotNull((it) =>
        it.upSince.seconds
          ? `Up for ${humanizeDuration(it.upSince.seconds)}`
          : null,
      )
      .orElse(null);
  }
  get data(): Fetched<UptimeStatusDto | undefined> {
    return this._data;
  }
  chartData: DonutChartData | null = null;
  upSinceTooltip: string | null = null;

  getComponentStatusCircleClass(status: ComponentStatusDto): string {
    switch (status) {
      case ComponentStatusDto.Up:
        return 'bg-emerald-500/20';
      case ComponentStatusDto.Pending:
      case ComponentStatusDto.Maintenance:
        return 'bg-amber-500/20';
      case ComponentStatusDto.Down:
        return 'bg-red-500/20';
    }
  }

  getComponentStatusInnerCircleClass(status: ComponentStatusDto): string {
    switch (status) {
      case ComponentStatusDto.Up:
        return 'bg-emerald-500';
      case ComponentStatusDto.Pending:
      case ComponentStatusDto.Maintenance:
        return 'bg-amber-500';
      case ComponentStatusDto.Down:
        return 'bg-red-500';
    }
  }

  getComponentStatusText(status: ComponentStatusDto): string {
    switch (status) {
      case ComponentStatusDto.Up:
        return 'Up';
      case ComponentStatusDto.Pending:
        return 'Pending';
      case ComponentStatusDto.Maintenance:
        return 'Maintenance';
      case ComponentStatusDto.Down:
        return 'Down';
    }
  }

  buildDonutChartData(dto: UptimeStatusDto): DonutChartData {
    let timeFrameMessage = '';
    if (dto.timeSpan.seconds) {
      timeFrameMessage = ` (last ${humanizeDuration(dto.timeSpan.seconds)})`;
    }

    let upPercent = dto.uptimePercentage;
    return {
      labels: [`Online${timeFrameMessage}`, `Offline${timeFrameMessage}`],
      datasets: [
        {
          data: [upPercent, 100 - upPercent],
          backgroundColor: ['#10B981', '#EF4444'],
        },
      ],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.formattedValue} %`,
            },
          },
        },
      },
    };
  }
}
