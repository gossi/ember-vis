import { tagName } from '@ember-decorators/component';
import VisCoreChild from '@ember-vis/core/components/vis-core-child/component';
import VisNetwork from '@ember-vis/network/components/vis-network/component';
import vis from 'vis';

@tagName('')
export default class VisNetworkNode extends VisCoreChild {
	container!: VisNetwork;

	label: string = '';
	id!: vis.IdType;
	type?: string;

	constructor() {
		super(...arguments);
		const observers = ['label', 'type'];
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
