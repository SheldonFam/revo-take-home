export const chartTheme = {
  colors: {
    primary: 'hsl(var(--chart-1))',
    secondary: 'hsl(var(--chart-2))',
    tertiary: 'hsl(var(--chart-3))',
    quaternary: 'hsl(var(--chart-4))',
    grid: 'hsl(var(--chart-grid))',
    axis: 'hsl(var(--muted-foreground))',
  },
  fontSize: 11,
  animationDuration: 300,
};

export const axisTickStyle = {
  fill: chartTheme.colors.axis,
  fontSize: chartTheme.fontSize,
};
