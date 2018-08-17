import { tagName } from '@ember-decorators/component';
import VisCoreChild from '@ember-vis/core/components/vis-core-child/component';
import VisCoreContainer from '@ember-vis/core/components/vis-core-container/component';
import vis from 'vis';
import VisNetworkEdge from '@ember-vis/network/components/vis-network/edge/component';
import VisNetworkNode from '@ember-vis/network/components/vis-network/node/component';

export interface NetworkElement extends HTMLDivElement {
	getNetwork(): vis.Network;
}

@tagName('')
export default class VisNetwork extends VisCoreContainer {

	options: vis.Options = this.options || {};

	nodes: vis.DataSet<vis.DataItem> = new vis.DataSet();
	edges: vis.DataSet<vis.DataItem> = new vis.DataSet();
	groups: vis.DataSet<vis.DataGroup> = new vis.DataSet();

	network?: vis.Network;

	selection?: string | number | vis.IdType[];
	selected?: string | number | vis.IdType[];

	firstRun: boolean = true;

	constructor() {
		super(...arguments);
	}

	didInsertElement() {
		super.didInsertElement();

		// setup
		this.network = this.setup();

		// public API
		const element = document.querySelector(`#${this.elementId}`);

		Object.defineProperty(element, 'getNetwork', {
			enumerable: true,
			writable: false,
			configurable: false,
			value: () => {
				return this.network;
			}
		});
	}

	setup(): vis.Network {
		const network = new vis.Network(
			document.querySelector(`#${this.elementId}`) as HTMLElement,
			{
				nodes: this.nodes,
				edges: this.edges
			},
			this.options
		);

		// network.on('select', (props) => {
		// 	this.handleSelect(props);
		// });

		// [].forEach(name => {
		// 	network.on(name, (props) => {
		// 		if (!this.isDestroyed || !this.isDestroying) {
		// 			this.trigger(name, props);
		// 		}
		// 	});
		// });
		const mappedEvents = {
			'oncontext': 'onContextMenu',
			'click': 'onClick',
			'doubleClick': 'onDoubleClick'
		};

		for (const [key, value] of Object.entries(mappedEvents)) {
			network.on(key, (props: any) => {
				this.trigger(value, props);
			});
		}
		// this.addObserver('selection', () => {
		// 	this.handleIncomingSelection();
		// });

		this.addObserver('options', () => {
			if (this.network) {
				this.network.setOptions(this.options);
			}
		});

		return network;
	}

	registerChild(child: VisCoreChild) {
		if (child instanceof VisNetworkNode) {
			this.addNode(child);
		} else if (child instanceof VisNetworkEdge) {
			this.addEdge(child);
		}
	}

	addNode(item: VisNetworkNode) {
		this.nodes.add({
			id: item.id,
			label: item.label,
			type: item.type
		});
	}

	addEdge(edge: VisNetworkEdge) {
		this.edges.add({
			id: edge.id,
			from: edge.from,
			to: edge.to
		});
	}

	// addGroup(group: VisNetworkEdge) {
	// 	if (!group.order) {
	// 		group.set('order', this.groups.length);
	// 	}
	// 	this.groups.add({
	// 		id: group.id,
	// 		content: group.content,
	// 		style: group.style,
	// 		order: group.order
	// 	});
	// }

	unregisterChild(child: VisCoreChild) {
		if (child instanceof VisNetworkNode) {
			this.nodes.remove(child.id);
		} else if (child instanceof VisNetworkEdge) {
			this.edges.remove(child.id);
		}
	}

	// handleSelect(props: any) {
	// 	this.trigger('selectionChanged', props.items, props.event);
	// }

	// handleIncomingSelection() {
	// 	if (this.selection && this.selection !== this.selected && this.network) {
	// 		this.network.setSelection(this.selection);
	// 	}
	// }
}
