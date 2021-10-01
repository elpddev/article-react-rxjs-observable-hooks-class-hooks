import React from "react";
import { Subject } from "rxjs";
import { filter, map, shareReplay, takeUntil } from "rxjs/operators";
import { BasicPad } from "./BasicPad";

export class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.lifecycles = handleLifecycles(this);
    this.mode$ = handleObserveProp(this, this.lifecycles, "mode");
    this.mathExpression$ = handleMathExpression(this, this.lifecycles);
  }

  render() {
    return <BasicPad></BasicPad>;
  }
}

function handleMathExpression(context, lifecycles) {}

function handleObserveProp(context, lifecycles, propName) {
  const obs$ = lifecycles.componentDidUpdate$.pipe(
    filter(({ prevProps }) => prevProps[propName] !== context.props[propName]),
    map(() => context.props[propName]),
    shareReplay({ refCount: true, buffer: 1 })
  );

  obs$.pipe(takeUntil(lifecycles.componentWillUnmount$)).subscribe();

  return obs$;
}

function handleLifecycles(component) {
  const componentDidMount$ = new Subject();
  const componentWillUnmount$ = new Subject();
  const componentDidUpdate$ = new Subject();

  const componentDidMountOrig = component.componentDidMount;
  const componentWillUnmountOrig = component.componentWillUnmount;
  const componentDidUpdateOrig = component.componentDidUpdate;

  component.componentDidMount = function () {
    componentDidMount$.next();

    if (componentDidMountOrig) {
      componentDidMountOrig.call(this);
    }
  };

  component.componentWillUnmount = function () {
    componentWillUnmount$.next();

    if (componentWillUnmountOrig) {
      componentWillUnmountOrig.call(this);
    }
  };

  component.componentDidUpdate = function (prevProps, prevState, snapshot) {
    componentDidUpdate$.next({
      prevProps,
      prevState,
      snapshot
    });

    if (componentDidUpdateOrig) {
      componentDidUpdateOrig.call(this);
    }
  };

  return {
    componentDidMount$,
    componentWillUnmount$,
    componentDidUpdate$
  };
}
