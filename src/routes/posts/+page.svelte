<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="POST" action="?/addPost" use:enhance>
	<div class="mt-10 flex flex-col items-center justify-center gap-5">
		<textarea
			name="text"
			class="block w-72 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			required
			placeholder="Write something..."
		/>
		<button type="submit" class="w-fit rounded-lg border bg-blue-600 p-3 font-semibold text-white">
			Save
		</button>
	</div>
</form>
<div class="mt-5 flex flex-col items-center justify-center gap-5">
	<div class="max-w-5xl">
		{#each data?.docs || [] as doc}
			<div class="border p-5">
				{doc.text}
			</div>
		{/each}
	</div>
</div>
