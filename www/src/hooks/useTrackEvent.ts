interface WindowObj {
  plausible?: Plausible;
}

type Plausible = (
  eventName: string,
  options?: { props?: EventProps; callback?: () => void }
) => void;

type EventProps = Record<string, string>;

type UseTrackEvent = () => Plausible;

const useTrackEvent: UseTrackEvent =
  () =>
  (eventName, options): void => {
    const plausible = (window as WindowObj).plausible;
    if (plausible) {
      plausible(eventName, options);
    }
  };

export default useTrackEvent;
