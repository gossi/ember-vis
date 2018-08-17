import { tagName } from '@ember-decorators/component';
import VisCoreChild from '@ember-vis/core/components/vis-core-child/component';
import VisNetwork from '@ember-vis/network/components/vis-network/component';
import vis from 'vis';

@tagName('')
export default class VisNetworkEdge extends VisCoreChild {
	container!: VisNetwork;

  from!: string;
  to!: string;
	id!: vis.IdType;

	constructor() {
		super(...arguments);
		const observers = ['from', 'to'];
		for (let prop of observers) {
			//@ts-ignore
			this.addObserver(prop, () => {
				// @ts-ignore
				this.container.items.update({
					id: this.id,
					[prop]: this.get(prop)
				});
			});
		}
	}
}
